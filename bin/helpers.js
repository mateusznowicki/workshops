const fs = require('fs')
const path = require('path')

const inquirer = require('inquirer')
const pug = require('pug')
const { prop } = require('ramda')

const NON_PROJECT_DIRS = ['base-templates', 'bin', 'node_modules', '.git', '.idea']

function getDirectories(base) {
    return fs
        .readdirSync(base)
        .map(name => ({ name, base, path: path.join(base, name) }))
        .filter(file => fs.statSync(file.path).isDirectory())
        .map(file => file.name)
}

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

module.exports = { projectExists, renderTemplate, getDirectories, renderProjectSelector, getProjects }
