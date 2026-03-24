import {test,expect } from '../../lib/BaseTest';

test(`Verify the text contents of PDF file.`, { tag: `@Smoke`}, async ({ webActions }) => {
    const extractedText = await webActions.getPDFText(`./utils/functional/sample.pdf`);
    const status = extractedText.includes(`A Simple PDF File`);
    expect(status).toBeTruthy();
}); 