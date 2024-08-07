const A="data:image/png;base64,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";export{A as default};