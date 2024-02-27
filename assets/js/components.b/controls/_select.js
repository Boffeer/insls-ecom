import {getClickedNotBeyondElement} from "../../helpers.b/get-helpers.js"

// Кастомный select

const CLASSES = {
  component: 'select',
  componentActive: 'select--active',
  input: 'select__input',
  toggle: 'select__toggle',
  toggleSelected: 'select__toggle--selected',
  option: 'select__option',
  optionActive: 'select__option--active',
  init: 'is-init',
}

const selectNodes = document.querySelectorAll(`.${CLASSES.component}`);

function initSelects(selectNodes) {
  selectNodes.forEach(selectNode => {
    if (selectNode.classList.contains(CLASSES.init)) return;

    const inputNode = selectNode.querySelector(`.${CLASSES.input}`);
    const toggleNode = selectNode.querySelector(`.${CLASSES.toggle}`);
    const optionNodes = [...selectNode.querySelectorAll(`.${CLASSES.option}`)];

    toggleNode.addEventListener('click', handleToggle);

    function selectOption(optionToSelectNode) {
      optionNodes.forEach(optionNode => optionNode.classList.remove(CLASSES.optionActive));
      const index = [...optionNodes].map((optionNode, index) => {
        if (optionToSelectNode.textContent === optionNode.textContent) {
          return index + 1;
        };
      })[0];
      optionToSelectNode.classList.add(CLASSES.optionActive);

      inputNode.selectedIndex = index;
      toggleNode.classList.add(CLASSES.toggleSelected);
      toggleNode.textContent = optionToSelectNode.textContent;

      selectNode.classList.remove(CLASSES.componentActive);
    }
    selectNode.selectOption = selectOption;


    optionNodes.forEach((optionNode, index, arr) => {
      optionNode.addEventListener('click', () => {
        optionNodes.forEach(optionNode => optionNode.classList.remove(CLASSES.optionActive));
        optionNode.classList.add(CLASSES.optionActive);
        inputNode.selectedIndex = index + 1;
        toggleNode.classList.add(CLASSES.toggleSelected);
        toggleNode.textContent = optionNode.textContent;

        selectNode.classList.remove(CLASSES.componentActive);
      });
    });

    function handleToggle(evt) {
      evt.stopPropagation();

      const openedSelects = document.querySelectorAll(`.${CLASSES.componentActive}`);
      openedSelects.forEach(openedSelect => openedSelect.classList.remove(CLASSES.componentActive))

      selectNode.classList.toggle(CLASSES.componentActive);

      if (selectNode.classList.contains(CLASSES.componentActive)) {
          toggleNode.removeEventListener('click', handleToggle);
          document.addEventListener('click', handleDocument);
      }
    }

    function handleDocument(e) {
      selectNode.classList.remove(CLASSES.componentActive);

      document.removeEventListener('click', handleDocument);
      selectNode.addEventListener('click', handleToggle);
    }

    selectNode.classList.add(CLASSES.init)
  });
}
initSelects(selectNodes);
