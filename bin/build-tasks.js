const path = require('path')
const fs = require('fs')

const pug = require('pug')

const { checkProject, renderTemplate, projectExists, getProjects, renderProjectSelector } = require('./helpers')

function getTemplates(base) {
    return fs
        .readdirSync(base)
        .map(name => ({ name, base, path: path.join(base, name) }))
        .filter(file => fs.statSync(file.path).isFile())
        .filter(file => file.name.endsWith('.pug'))
        .map(file => file.path)
}

(async () => {
    let project = process.argv[process.argv.length - 1]
    const cwd = process.cwd()

    if (process.argv.length == 2 || !projectExists(cwd, project)) {
        const projects = getProjects(cwd);
        project = await renderProjectSelector(projects)
    }

    const templates = getTemplates(path.join(path.join(cwd, project), 'tasks'))
    templates.forEach(renderTemplate)

    console.log(`Success! HTML for tasks in project ${project} is built`)
})()
