const A="data:image/png;base64,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";export{A as default};