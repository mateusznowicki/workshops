const path = require('path');
const fs = require('fs');

const pug = require('pug');
const { pipe, map, filter } = require('ramda');

const {getProjects, getTemplates, projectExists, renderProjectSelector, renderTemplate} = require("./helpers");

const getSlides = dir => pipe(
    dir => fs.readdirSync(dir),
    map(name => path.join(dir, name)),
    filter(path => fs.statSync(path).isDirectory()),
    map(dirPath => ({dir: dirPath, templates: getTemplates(dirPath).map(templatePath => path.parse(templatePath).name).sort()})),
)(dir)

const renderIndex = (dir, slides) => {
    const html = pug.compileFile(path.join(__dirname, '..', 'base-templates', 'slides-index.pug'), { pretty: true })({slides})

    fs.writeFileSync(path.join(dir, 'index.html'), html)
}

(async () => {
    let project = process.argv[process.argv.length - 1]
    const cwd = process.cwd()

    if (process.argv.length == 2 || !projectExists(cwd, project)) {
        const projects = getProjects(cwd);
        project = await renderProjectSelector(projects)
    }

    const projectBase = path.join(path.join(cwd, project), 'slides')

    getTemplates(projectBase).forEach(renderTemplate)
    getSlides(projectBase).forEach(({dir, templates}) => renderIndex(dir, templates))

    console.log(`Success! HTML for slides in project ${project} is built`)
})()
