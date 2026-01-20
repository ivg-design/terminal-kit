# Terminal Kit Documentation

Terminal Kit is a retro-futuristic web components library built with Lit 3.x and a terminal-inspired design system.

## Quick Start

```html
<!-- Import the components you need -->
<script type="module">
  import '../js/components/TPanelLit.js';
  import '../js/components/TButtonLit.js';
</script>

<t-pnl title="System Control" collapsible>
  <div slot="actions">
    <t-btn variant="primary">Execute</t-btn>
  </div>
  <p>Panel content goes here</p>
</t-pnl>
```

## Documentation Map

- Component catalog and demos: [`docs/README.md`](./README.md)
- Component schema: [`docs/COMPONENT_SCHEMA.md`](./COMPONENT_SCHEMA.md)
- Component specs: [`docs/COMPONENT_SPECIFICATIONS.md`](./COMPONENT_SPECIFICATIONS.md)
- Testing guide: [`docs/testing/README.md`](./testing/README.md)
- Third-party notices: [`docs/third-party.md`](./third-party.md)

## Third-Party Credits

This project uses external libraries and assets (Lit, GridStack, iro.js, marked, PrismJS, Phosphor Icons, and loader libraries). See the third-party notices for license details.

## Demo Tint Picker

All demos include a global tint picker that updates `--terminal-green` for quick palette inspection.

## License

MIT
