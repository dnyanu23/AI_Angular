const fileInput = document.getElementById('file-input');
const textOutput = document.getElementById('text-output');

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
        const pdf = await pdfjsLib.getDocument({ data: reader.result }).promise;
        const maxPages = pdf.numPages;

        let text = '';
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join('\n');
            text += pageText + '\n';
        }

        textOutput.textContent = text;
    };
});
