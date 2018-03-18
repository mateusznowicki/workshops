const fs = require('fs')
const path = require('path')

const inquirer = require('inquirer')
const pug = require('pug')
const { prop, map, chain, pipe } = require('ramda')

const NON_PROJECT_DIRS = ['base-templates', 'bin', 'node_modules', '.git', '.idea']

function getDirectories(base) {
    return fs
        .readdirSync(base)
        .map(name => ({ name, base, path: path.join(base, name) }))
        .filter(file => fs.statSync(file.path).isDirectory())
        .map(file => file.name)
}

const getTemplates = base => pipe(
    dir => fs.readdirSync(dir),
    map(name => ({ name, base, path: path.join(base, name) })),
    chain(file => {
        const stat = fs.statSync(file.path);

        if (stat.isFile() && file.name.endsWith('.pug')) {
            return [file.path];
        } else if (stat.isDirectory()) {
            return getTemplates(file.path)
        } else {
            return [];
        }
    }))(base)

function getProjects (cwd) {
    return getDirectories(cwd).filter(name => !NON_PROJECT_DIRS.includes(name))
}

const projectExists = (cwd, project) => !NON_PROJECT_DIRS.includes(project) && fs.existsSync(path.resolve(cwd, project))

async function renderProjectSelector (projects) {
    return inquirer.prompt({
        type: 'list',
        name: 'answer',
        message: 'Select project',
        choices: projects,
    }).then(prop('answer'))
}

function renderTemplate(path) {
    const html = pug.compileFile(path, { pretty: true })()

    fs.writeFileSync(path.replace('.pug', '.html'), html)
}

module.exports = { projectExists, renderTemplate, getDirectories, renderProjectSelector, getProjects, getTemplates }
