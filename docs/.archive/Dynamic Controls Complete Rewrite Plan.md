## Dynamic Controls Complete Rewrite Plan
### Objective
     Understanding the Parser Output

     The Rive parser creates a blueprint with this structure:
    ``` json
     {
       artboards: [],
       stateMachines: [
         {
           name: "State Machine Name",
           inputs: [
             { name: "input1", type: "boolean" },
             { name: "input2", type: "number", min: 0, max: 100 }
           ]
         }
       ],
       viewModel: {
         name: "ViewModelName",
         blueprintName: "DisplayName",
         properties: [
           { name: "propName", type: "boolean", value: true },
           { name: "speed", type: "number", value: 50 },
           { name: "color", type: "color", value: 0xff00ff41 },
           { name: "mode", type: "enumType", metadata: { enumValues: ["auto", "manual"] } },
           { name: "text", type: "string", value: "Hello" },
           { name: "action", type: "trigger" }
         ],
         nestedViewModels: [
           // Recursive structure with same format
         ]
       }
     }
     ```

     ## Phase 1: Clean Up

     1. Delete duplicate files:
       - Remove TerminalDynamicControlsRive.js
       - Remove TerminalDynamicControls-Enhanced.js
       - Remove dynamic-controls-rive.html
       - Remove dynamic-controls-rive-demo.html
       - Keep ONLY: TerminalDynamicControls.js, dynamic-controls.html, dynamic-controls.css

     Phase 2: Rewrite TerminalDynamicControls.js

     Schema Structure (matching parser output)

     // The component will accept schema directly from parser:
     ```json
      {
       stateMachines: [...],  // State machine controls
       viewModel: {...}       // ViewModel hierarchy
     }
    ```
    ## Control Type Mapping

     Parser Type → Terminal Component:
     - boolean → <terminal-toggle variant="checkbox">
     - number → <terminal-input type="number">
     - string → <terminal-input type="text">
     - color → <terminal-color-picker variant="minimal">
     - enumType → <terminal-dropdown searchable="false">
     - trigger → <terminal-button variant="primary">
     - Nested VMs → <terminal-panel collapsible>

     Key Implementation Details

     1. Component Architecture:
     class TerminalDynamicControls extends TerminalComponent {
       // Accept Rive blueprint directly
       setSchema(blueprint) {
         this.setProp('schema', blueprint);
         this.render();
       }

       // Render controls from blueprint
       renderControls(schema) {
         let html = '';

         // State Machine section
         if (schema.stateMachines?.length > 0) {
           schema.stateMachines.forEach(sm => {
             html += this.renderStateMachine(sm);
           });
         }

         // ViewModel section
         if (schema.viewModel) {
           html += this.renderViewModel(schema.viewModel);
         }

         return html;
       }
     }

     2. Proper Component Usage:
     // Panel with proper slots
     renderViewModel(vm, depth = 0) {
       const controlId = `vm-${vm.name}`;
       return `
         <terminal-panel
           id="${controlId}"
           title="${vm.blueprintName || vm.name}"
           collapsible
           compact
         >
           <div slot="content">
             ${this.renderProperties(vm.properties)}
             ${this.renderNestedViewModels(vm.nestedViewModels, depth + 1)}
           </div>
         </terminal-panel>
       `;
     }

     // Boolean with accessibility
     renderBoolean(prop) {
       const id = `control-${prop.name}`;
       return `
         <div class="control-row">
           <label for="${id}">${prop.name}</label>
           <terminal-toggle
             id="${id}"
             name="${prop.name}"
             variant="checkbox"
             ${prop.value ? 'checked' : ''}
           ></terminal-toggle>
         </div>
       `;
     }

     3. Event Handling:
     afterRender() {
       // Listen to component events properly
       this.addEventListener('toggle-change', (e) => {
         const name = e.target.getAttribute('name');
         this.updateValue(name, e.detail.checked);
       });

       this.addEventListener('input-change', (e) => {
         const name = e.target.getAttribute('name');
         this.updateValue(name, e.detail.value);
       });

       this.addEventListener('color-change', (e) => {
         const name = e.target.getAttribute('name');
         // Convert hex to ARGB for Rive
         const argb = this.hexToArgb(e.detail.value);
         this.updateValue(name, argb);
       });
     }

     4. NO Re-rendering on Value Change:
     updateValue(path, value) {
       // Update internal state
       const values = { ...this.getProp('values') };
       this.setValueByPath(values, path, value);
       this.setProp('values', values);

       // Emit event WITHOUT re-rendering
       this.emit('control-change', { path, value });

       // DO NOT call this.render() here!
     }

     Phase 3: CSS Updates

     Add missing styles to dynamic-controls.css:
     /* Control rows */
     .control-row {
       display: flex;
       align-items: center;
       gap: var(--spacing-sm);
       padding: var(--spacing-xs) 0;
     }

     .control-row label {
       flex: 0 0 120px;
       color: var(--terminal-green);
       font-size: var(--font-size-sm);
     }

     /* Nested panels */
     .dynamic-control-group {
       margin-bottom: var(--spacing-sm);
     }

     .dynamic-control-group[data-level="1"] {
       margin-left: var(--spacing-md);
     }

     /* Remove image preview inline styles */
     .image-preview {
       margin-top: var(--spacing-xs);
       max-width: 100px;
       border: 1px solid var(--terminal-green-dim);
     }

     Phase 4: Demo Page Update

     Update dynamic-controls.html with realistic Rive-like schema:
     const riveSchema = {
       stateMachines: [
         {
           name: "MainController",
           inputs: [
             { name: "isPlaying", type: "boolean" },
             { name: "progress", type: "number", min: 0, max: 100 }
           ]
         }
       ],
       viewModel: {
         name: "AppViewModel",
         blueprintName: "App Settings",
         properties: [
           { name: "enabled", type: "boolean", value: true },
           { name: "speed", type: "number", value: 1.0 },
           { name: "theme", type: "color", value: 0xff00ff41 },
           { name: "mode", type: "enumType",
             metadata: { enumValues: ["auto", "manual", "hybrid"] }
           }
         ],
         nestedViewModels: [
           {
             name: "UserSettings",
             blueprintName: "User Preferences",
             properties: [
               { name: "username", type: "string", value: "User" },
               { name: "notifications", type: "boolean", value: false }
             ]
           }
         ]
       }
     };

     Phase 5: Testing Checklist

     1. ✅ No console errors
     2. ✅ No inline styles in JS
     3. ✅ Proper form accessibility (IDs, names, labels)
     4. ✅ Components use correct APIs
     5. ✅ No search in dropdowns
     6. ✅ Panel icons properly sized
     7. ✅ Checkbox toggles visually
     8. ✅ Color picker works without Pickr errors
     9. ✅ No unnecessary re-renders
     10. ✅ Nested panels work 5+ levels deep

     Implementation Order

     1. Clean up duplicate files
     2. Rewrite TerminalDynamicControls.js using parser schema format
     3. Update dynamic-controls.css
     4. Update demo with Rive-like test data
     5. Test each control type
     6. Fix any component bugs found
     7. Final validation

     This approach uses the ACTUAL parser output format and existing Terminal components correctly.