import fs from 'fs';
import handlebars from 'handlebars';

interface Data {
    companyLogo: string;
    userName: string;
    resetLink: string;
}

const generateHTML = async (data: Data, templatePath: string): Promise<string> => {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateContent);
    const html = template({ data });
    return html;
}

export { generateHTML };
