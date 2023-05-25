import jsonData from './people.json' assert {type: 'json'};


class PeopleList {
    constructor(data) {
        this.data = data;
        this.listContainer = document.querySelector('.list');
        this.selectedObj = null;
        this.selectedLine;
    }

    createInterface() {
        this.showPeople();
        this.addFilters();
        this.addNewPersonBtnEvent();
        this.addPopupEvents();
    }

    addFilters() {
        const searchBtn = document.getElementById('search');
        const searchForm = document.getElementById('filter-list');
        searchBtn.addEventListener('click', () => {
            let filters = searchForm.elements;
            this.generateFilteredList(filters['name'].value, filters['department'].value);
        })
    }

    generateFilteredList(nameFilter, departmentFilter) {
        this.listContainer.textContent = '';
        this.showPeople(this.data.filter(person => {
            return (person.name.toLowerCase()).includes(nameFilter.toLowerCase()) 
            && (departmentFilter ? person.department == departmentFilter : true)
        }))
    }

    showPeople(data=this.data) {
        this.listContainer.textContent = '';
        data.forEach(objPerson => {
            let line = this.createLine(objPerson);
            this.listContainer.appendChild(line);
        })
    }

    createLine(objPerson) {
        let line = document.createElement('div');

        let nameField = document.createElement('div');
        nameField.textContent = objPerson.name;
        line.appendChild(nameField);

        let departmentField = document.createElement('div');
        departmentField.textContent = objPerson.department == 1 ? 'IT' : 'Marketing';
        line.appendChild(departmentField);

        let actionField = document.createElement('div');
        let selector = this.createActionSelector(objPerson);
        actionField.appendChild(selector);
        line.appendChild(actionField);

        line.setAttribute('class','line');
        this.addLineEvents(line, selector);
        return line;
    }

    createActionSelector(objPerson) {
        let selector = document.createElement('select');
        selector.classList.add('action-selector');

        let placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.hidden = true;
        placeholder.text = 'Select Action';
        selector.appendChild(placeholder);

        let editOption = document.createElement('option');
        editOption.value = '1';
        editOption.text = 'Edit';
        selector.appendChild(editOption);

        let deleteOption = document.createElement('option');
        deleteOption.value = '2';
        deleteOption.text = 'Delete';
        selector.appendChild(deleteOption);
        
        this.addSelectorEvents(selector, objPerson);

        return selector;
    }

    addLineEvents(line, selector) {
        line.addEventListener('mouseover', () => {
            line.classList.add('line-hover');
            selector.classList.add('show-action-selector');
        });
        line.addEventListener('mouseout', () => {
            line.classList.remove('line-hover');
            selector.classList.remove('show-action-selector');
            selector.value = ''
        });
    }

    addSelectorEvents(selector, selectedPerson) {
        selector.addEventListener('change', () => {
            this.selectedLine = selector.parentNode.parentNode;
            if (selector.value == 1) {
                this.editSelectedPerson(selectedPerson);
            } else {
                this.deletePerson(selectedPerson);
            }
        })
    }

    editSelectedPerson(person) {
        let popup = document.querySelector('.popup');
        document.getElementById("popup-legend").textContent = 'Edit';
        document.getElementById('popup-name').value = person.name;
        document.getElementById('popup-department').value = person.department;
        popup.style.display = 'flex';
        this.selectedObj = person;
    }

    deletePerson(deletedPerson) {
        this.selectedLine.parentNode.removeChild(this.selectedLine);
        this.data = this.data.filter(person => person != deletedPerson)
    }

    addPopupEvents() {
        let saveBtn = document.getElementById('popup-save');
        saveBtn.addEventListener('click', () => {
            let newData = document.getElementById('popup').elements;
            let newName = newData['popup-name'].value;
            let newDepartment = newData['popup-department'].value;

            if(this.selectedObj && (this.selectedObj.name !== newName || this.selectedObj.department !== newDepartment)) {
                this.editLine(newName, newDepartment);
            } else if (this.selectedObj == null && newName.length > 2 && newDepartment) {
                this.addNewPerson(newName, newDepartment);
            }
        })

        let closeBtn = document.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.querySelector('.popup').style.display = 'none';
        })
    }

    editLine(newName, newDepartment) {
        this.selectedObj.name = newName;
        this.selectedObj.department = newDepartment;
        this.selectedLine.children[0].textContent = newName;
        this.selectedLine.children[1].textContent = newDepartment == 1 ? 'IT' : 'Marketing';
        this.selectedObj = null;
        document.querySelector('.popup').style.display = 'none';
    }

    addNewPerson(newName, newDepartment) {
        this.data.push({ "name": newName, "department": newDepartment });
        this.showPeople();
        document.querySelector('.popup').style.display = 'none';
    }

    addNewPersonBtnEvent() {
        let popup = document.querySelector('.popup');
        let newBtn = document.getElementById('new-person-btn');
        newBtn.addEventListener('click', () => {
            document.getElementById("popup-legend").textContent = 'New';
            document.getElementById('popup-name').value = '';
            document.getElementById('popup-department').value = '';
            popup.style.display = 'flex';
        })
    }
}


let appInterface = new PeopleList(jsonData);
appInterface.createInterface();




