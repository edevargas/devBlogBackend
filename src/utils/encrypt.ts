const bcrypt = require('bcrypt')

const encrypt = async (str: string) => {
  const saltRound = 10
  return await bcrypt.hash(str, saltRound)
}

export default encrypt