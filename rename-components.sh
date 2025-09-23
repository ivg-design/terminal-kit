#!/bin/bash

# CSS File Renames
echo "Renaming CSS files..."
mv css/components/button.css css/components/old-button.css 2>/dev/null
mv css/components/buttons.css css/components/old-buttons.css 2>/dev/null
# t-btn.css already exists

mv css/components/panel.css css/components/t-pnl.css 2>/dev/null
mv css/components/color-picker.css css/components/t-clr.css 2>/dev/null
mv css/components/dropdown.css css/components/t-drp.css 2>/dev/null
mv css/components/form.css css/components/t-inp.css 2>/dev/null
mv css/components/loader.css css/components/t-ldr.css 2>/dev/null
mv css/components/modal.css css/components/t-mdl.css 2>/dev/null
mv css/components/toast.css css/components/t-tst.css 2>/dev/null
mv css/components/toggle.css css/components/t-tog.css 2>/dev/null
mv css/components/slider.css css/components/t-sld.css 2>/dev/null
mv css/components/tree-view.css css/components/t-tre.css 2>/dev/null
mv css/components/status-bar.css css/components/t-sta.css 2>/dev/null
mv css/components/user-menu.css css/components/t-usr.css 2>/dev/null
mv css/components/dynamic-controls.css css/components/t-dyn.css 2>/dev/null
# Keep auth.css and canvas.css as is for now

# JS File Renames
echo "Renaming JS files..."
mv js/components/TerminalComponent.js js/components/TComponent.js 2>/dev/null
mv js/components/TerminalButton.js js/components/TButton.js 2>/dev/null
mv js/components/TerminalPanel.js js/components/TPanel.js 2>/dev/null
mv js/components/TerminalColorPicker.js js/components/TColorPicker.js 2>/dev/null
mv js/components/TerminalDropdown.js js/components/TDropdown.js 2>/dev/null
mv js/components/TerminalInput.js js/components/TInput.js 2>/dev/null
mv js/components/TerminalLoader.js js/components/TLoader.js 2>/dev/null
mv js/components/TerminalModal.js js/components/TModal.js 2>/dev/null
mv js/components/TerminalToast.js js/components/TToast.js 2>/dev/null
mv js/components/TerminalToggle.js js/components/TToggle.js 2>/dev/null
mv js/components/TerminalSlider.js js/components/TSlider.js 2>/dev/null
mv js/components/TerminalTreeView.js js/components/TTreeView.js 2>/dev/null
mv js/components/TerminalTreeNode.js js/components/TTreeNode.js 2>/dev/null
mv js/components/TerminalStatusBar.js js/components/TStatusBar.js 2>/dev/null
mv js/components/TerminalStatusField.js js/components/TStatusField.js 2>/dev/null
mv js/components/TerminalTextarea.js js/components/TTextarea.js 2>/dev/null
mv js/components/TerminalUserMenu.js js/components/TUserMenu.js 2>/dev/null
mv js/components/TerminalDynamicControls.js js/components/TDynamicControls.js 2>/dev/null

# Archive old/duplicate files
mkdir -p archive_v2/old-components
mv js/components/TerminalColorPickerFixed.js archive_v2/old-components/ 2>/dev/null
mv js/components/TerminalColorPickerRefactored.js archive_v2/old-components/ 2>/dev/null
mv js/components/SimpleColorPicker.js archive_v2/old-components/ 2>/dev/null
mv css/components/simple-color-picker.css archive_v2/old-components/ 2>/dev/null

echo "Component renaming complete!"