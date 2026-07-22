import { StButtonWrapper } from './StButton.js';
import { StLabelWrapper } from './StLabel.js';
import { StBoxLayoutWrapper } from './StBoxLayout.js';
import { StIconWrapper } from './StIcon.js';
import { StBinWrapper } from './StBin.js';
import { StScrollViewWrapper } from './StScrollView.js';
import { StEntryWrapper } from './StEntry.js';

export const $ = {
    button: (params) => {
        const btn = new StButtonWrapper(params);
        return btn;
    },
    label: (params) => {
        const lbl = new StLabelWrapper(params);
        if (params?.text) lbl.text(params.text);
        return lbl;
    },
    box: (params) => {
        const box = new StBoxLayoutWrapper(params);
        return box;
    },
    icon: (params) => new StIconWrapper(params),
    bin: (params) => new StBinWrapper(params),
    scrollView: (params) => new StScrollViewWrapper(params),
    entry: (params) => new StEntryWrapper(params)
};
