const path = require('path')

const { projectExists, renderTemplate, getProjects, renderProjectSelector } = require('./helpers');

(async () => {
    let project = process.argv[process.argv.length - 1]
    const cwd = process.cwd()

    if (process.argv.length == 2 || !projectExists(cwd, project)) {
        const projects = getProjects(cwd);
        project = await renderProjectSelector(projects)
    }

    const index = path.join(cwd, project, 'index.pug')
    renderTemplate(index)

    console.log(`Success! HTML for tasks in project ${project} is built`)
})()
