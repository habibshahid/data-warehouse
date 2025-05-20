const { dbConnections, BiAttributes } = require('../models');


// Get all queues from sql
exports.getQueues = async (req, res) => {
  try {

    const queues = await dbConnections?.default?.sequelize.model("yovo_tbl_queues").findAll({
      where: {
        deleted: false
      },
      attributes: [['name', 'value'], ['name', 'label']],
      raw: true,
    })

    return res.json({ success: true, queues })

  }
  catch (error) {
    return res.status(500).json({ success: false, error: { message: "Server Error", reason: error.message } })
  }
};

exports.getChannels = async (req, res) => {
  try {

    const channels = await dbConnections?.default?.sequelize.model("yovo_tbl_channels").findAll({
      attributes: [['channel', 'value'], ['channel', 'label']],
      raw: true,
    })

    return res.json({ success: true, channels })

  }
  catch (error) {
    return res.status(500).json({ success: false, error: { message: "Server Error", reason: error.message } })
  }
};

exports.getBiAttributes = async (req, res) => {
  try {
    const attributes = await BiAttributes.find({})

    let callCenterBiAttributes = []
    let agentJournalBiAttributes = []
    let messagesBiAttributes = []
    let workCodesBiAttributes = []
    let feedbackBiAttributes = []


    if (Array.isArray(attributes)) {

      callCenterBiAttributes = attributes.filter(item => {
        return item.derivedCollection === "interactions"
      })

      agentJournalBiAttributes = attributes.filter(item => {
        return item.derivedCollection === "agentJournal"
      })

      messagesBiAttributes = attributes.filter(item => {
        return item.derivedCollection === "messages"
      })

      workCodesBiAttributes = attributes.filter(item => {
        return item.derivedCollection === "workCodes"
      })

      feedbackBiAttributes = attributes.filter(item => {
        return item.derivedCollection === "feedbackStats"
      })

    }

    res.status(200).json({
      success: true,
      attributes: {
        contactCenter: callCenterBiAttributes,
        agentJournal: agentJournalBiAttributes,
        messages: messagesBiAttributes,
        workCodes: workCodesBiAttributes,
        feedback: feedbackBiAttributes,
      },
      models: [
        { value: 'contactCenter', label: "Contact Center" },
        { value: 'agentJournal', label: "Agent Journal" }
      ]
    })
  }
  catch (error) {
    res.status(500).json({ success: false, error: { error: "Server Error", reason: error.message } })
  }
}