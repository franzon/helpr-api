/*
async function getUser(req, res) {
  const { email } = req.body;

  const user = await models.User.findOne({ email });

  if(!user) {
    return res.json({ success: true, data: null });
  }

  return res.json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}

async function getUserById(req, res) {
  const { id } = req.params;

  const user = await models.User.findOne({ _id: id });

  if(!user) {
    return res.json({ success: true, data: null });
  }

  return res.json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
}

async function updateUser(req, res) {
  const { id, name, email, phone, password } = req.body;

  try {
    const user = await models.User.findOneAndUpdate({ _id: id }, {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(password !== undefined ? { 
          password: await bcrypt.hash(password, 10),
        } : {}),
    });

    if(!user) {
      return res.status(400).json({ success: false, data: null });
    }

    return res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      }
    })
  } catch(error) {
    return res.status(400).json({
      success: false, data: null,
      message: 'erro ao atualizar o usuario',
    });
  }
}

async function deleteUser(req, res) {
  const  { id } = req.body;

  try {
    const user = await models.User.deleteOne({ _id: id });

    if(!user) {
      return res.json({ success: true, data: null });
    }

    return res.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    })

  } catch(error) {
    return res.status(400).json({ success: false, data: null });
  }
}
*/