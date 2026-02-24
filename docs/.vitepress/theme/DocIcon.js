import { defineComponent, h } from 'vue';
import { getIcon } from '../../../js/utils/phosphor-icons.js';

export default defineComponent({
	name: 'DocIcon',
	props: {
		name: {
			type: String,
			required: true
		},
		variant: {
			type: String,
			default: 'regular'
		},
		size: {
			type: [Number, String],
			default: 14
		},
		title: {
			type: String,
			default: ''
		}
	},
	computed: {
		svg() {
			return getIcon(this.name, this.variant) || getIcon('question');
		},
		pixelSize() {
			const parsed = Number(this.size);
			return Number.isFinite(parsed) && parsed > 0 ? parsed : 14;
		}
	},
	render() {
		return h('span', {
			class: 'doc-icon',
			title: this.title || null,
			'aria-hidden': this.title ? 'false' : 'true',
			style: {
				width: `${this.pixelSize}px`,
				height: `${this.pixelSize}px`
			},
			innerHTML: this.svg
		});
	}
});
