const path = require('path');

const Sequelize = require('sequelize');
const { User, UserLevel } = require(path.join(__dirname, '../server/models'));
const { Command } = require('commander');

const program = new Command();

program
  .name('manage')
  .description('Performs management activities for the database.');

program.command('createuser')
  .description('create a new user')
  .argument('<firstname>', 'First Name')
  .argument('<lastname>', 'Last Name')
  .argument('<email>', 'Email')
  .argument('<password>', 'Password')
  .argument('[userlevel]', 'User Level', 'Member')
  // .option('--first', 'display just the first substring')
  // .option('-s, --separator <char>', 'separator character', ',')
  .action(async (firstname, lastname, email, password, userlevel, options) => {
    const lvl = await UserLevel.findOne({where: {name: userlevel}});

    if(!lvl?.id) {
      throw new Error('Unable to get user level')
    }

    const user = User.build({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
      userLevelId: lvl.id
    });
    user.save();

    console.log('User Created. #', user.id)

    return Promise.resolve();
  });


async function main() {
  await program.parseAsync(process.argv);
}

main();