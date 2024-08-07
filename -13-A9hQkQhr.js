const A="data:image/png;base64,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";export{A as default};
