
const models = require('../../database/models');

async function addService(req, res) {
  const {
    client,
    provider,
    activity,
    description,
    value,
  } = req.body;

  const providerRequired = await models.Provider.findById(provider);

  if (!providerRequired) {
    return res.status(400).send({
      message: 'Provider not found',
      data: null,
    });
  }

  const clientRequester = await models.User.findById(client);

  if (!clientRequester) {
    return res.status(400).send({
      message: 'Client not found',
      data: null,
    });
  }

  const activityRequested = await models.ActivitiesProvider.findById(activity);

  if (!activityRequested) {
    return res.status(400).send({
      message: 'Activity not found',
      data: null,
    });
  }

  const service = await models.Service.create({
    client,
    provider,
    activity,
    description,
    value,
  });

  return res.status(200).send({
    message: 'success',
    data: service,
  });
}

async function cancelService(req, res) {
  const { service } = req.body;

  const serviceCanceled = await models.Service.findOneAndUpdate({ _id: service }, { status: 0 });

  if (!serviceCanceled) {
    return res.status(400).send({
      message: 'Service not found',
      data: null,
    });
  }

  return res.status(200).send({
    message: 'success',
  });
}

async function acceptService(req, res) {
  const { provider, service } = req.body;

  const serviceReceived = await models.Service.findOne({ _id: service, provider });

  if (!serviceReceived) {
    return res.status(400).send({
      message: 'Service not found',
      data: null,
    });
  }

  if (serviceReceived.status === 0) {
    return res.status(400).send({
      message: 'Service already canceled',
      data: null,
    });
  }

  if (serviceReceived.status === 2) {
    return res.status(200).send({
      message: 'Service already accepted',
      data: null,
    });
  }

  if (serviceReceived.status === 3) {
    return res.status(200).send({
      message: 'Service already denyed',
      data: null,
    });
  }

  const serviceAccepted = await models.Service.findByIdAndUpdate(service, { status: 2 });

  return res.status(200).send({
    message: 'success',
    data: serviceAccepted,
  });
}

async function denyService(req, res) {
  const { service } = req.body;

  const serviceReceived = await models.Service.findById(service);

  if (!serviceReceived) {
    return res.status(400).send({
      message: 'Service not found',
      data: null,
    });
  }

  if (serviceReceived.status === 0) {
    return res.status(400).send({
      message: 'Service already canceled',
      data: null,
    });
  }

  if (serviceReceived.status === 2) {
    return res.status(200).send({
      message: 'Service already accepted',
      data: null,
    });
  }

  if (serviceReceived.status === 3) {
    return res.status(200).send({
      message: 'Service already denyed',
      data: null,
    });
  }

  await models.Service.findByIdAndUpdate(serviceReceived.id, { status: 3 });

  return res.status(200).send({});
}
module.exports = {
  addService,
  cancelService,
  acceptService,
  denyService,
};
