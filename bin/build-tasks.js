const path = require('path')
const fs = require('fs')

const pug = require('pug')

function getDirectories (base) {
    return fs.readdirSync(base)
        .map(name => ({ name, base, path: path.join(base, name) }))
        .filter(file => fs.statSync(file.path).isDirectory())
        .map(file => file.name);
}

function getTemplates(base) {
    return fs
        .readdirSync(base)
        .map(name => ({ name, base, path: path.join(base, name) }))
        .filter(file => fs.statSync(file.path).isFile())
        .filter(file => file.name.endsWith('.pug'))
        .map(file => file.path)
}

function renderTemplate(path) {
    const html = pug.compileFile(path, { pretty: true })()

    fs.writeFileSync(path.replace('.pug', '.html'), html)
}

function checkProject (cwd, project) {
    const excluded = ['base-templates', 'bin', 'node_modules', '.git', '.idea'];
    if (excluded.includes(project)) {
        throw new Error(`Project cannot be any of ${excluded}`);
    }

    if (!fs.existsSync(path.resolve(cwd, project))) {
        const availableProjects = getDirectories(cwd)
            .filter(name => !excluded.includes(name))
            .map(name => `\n* ${name}`)
            .join('');
        throw new Error(`Project ${project} does not exist. Available projects are: ${availableProjects}`);
    }
}

try {
    const project = process.argv[process.argv.length - 1]
    const cwd = process.cwd();

    checkProject(cwd, project);

    const templates = getTemplates(
        path.join(path.join(cwd, project), 'tasks'),
    )
    templates.forEach(renderTemplate)

    console.log(`Success! HTML for tasks in project ${project} is built`);
} catch (e) {
    console.error(e.message);
}
