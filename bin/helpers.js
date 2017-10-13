const fs = require('fs')
const path = require('path')

const pug = require('pug')

function getDirectories(base) {
    return fs
        .readdirSync(base)
        .map(name => ({ name, base, path: path.join(base, name) }))
        .filter(file => fs.statSync(file.path).isDirectory())
        .map(file => file.name)
}

function checkProject(cwd, project) {
    const excluded = ['base-templates', 'bin', 'node_modules', '.git', '.idea']
    if (excluded.includes(project)) {
        throw new Error(`Project cannot be any of ${excluded}`)
    }

    if (!fs.existsSync(path.resolve(cwd, project))) {
        const availableProjects = getDirectories(cwd)
            .filter(name => !excluded.includes(name))
            .map(name => `\n* ${name}`)
            .join('')
        throw new Error(
            `Project ${project} does not exist. Available projects are: ${availableProjects}`,
        )
    }
}

function renderTemplate(path) {
    const html = pug.compileFile(path, { pretty: true })()

    fs.writeFileSync(path.replace('.pug', '.html'), html)
}

module.exports = { checkProject, renderTemplate, getDirectories }
