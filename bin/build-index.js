const path = require('path')

const { checkProject, renderTemplate } = require('./helpers')

try {
    const project = process.argv[process.argv.length - 1]
    const cwd = process.cwd()

    checkProject(cwd, project)

    const index = path.join(cwd, project, 'index.pug')
    renderTemplate(index)

    console.log(`Success! HTML for tasks in project ${project} is built`)
} catch (e) {
    console.error(e.message)
}
