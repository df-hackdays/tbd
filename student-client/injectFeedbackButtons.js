(function() {
  // just place a div at top right
  	var div = document.createElement('div');
  	div.style.display = 'flex';
  	div.style.width = '200px';
    div.style.align = 'center';
    div.style.verticalAlign = 'middle';

    div.innerHTML = `
      <div style="display: block;">
        <div style="height: calc(50% - 200px); width: 100px;"></div>
        <button aria-label="Get Some Help" style="width: 100px; height: 100px; background-color: yellow; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="Get Some Help" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('question.svg') + `"></button>
        <button aria-label="All Done!" style="width: 100px; height: 100px; background-color: mediumSeaGreen; margin: 50px;" class="action-menu_button_1qbot action-menu_main-button_3ccfy" data-for="tooltip-0.8513344296356962" data-tip="All Done!" currentitem="false"><img style="width: 50px; height: 50px;" class="action-menu_main-icon_1ktMc" draggable="false" src="` + chrome.extension.getURL('check.svg') + `"></button>
      </div>
      `;

  	document.getElementsByClassName('gui_flex-wrapper_uXHkj box_box_2jjDp')[0].appendChild(div);
   })();
