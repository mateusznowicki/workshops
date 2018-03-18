const path = require('path')

const { renderTemplate, projectExists, getProjects, renderProjectSelector, getTemplates } = require('./helpers')

;(async () => {
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
