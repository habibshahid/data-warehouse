const mongoose = require("mongoose")

const collectionName = "biAttributes"

const biAttributesSchema = new mongoose.Schema({
  derivedCollection: String,
  formula: Object,
  altFormula: {
    type: String,
    default: null
  },
  label: String,
  physical: Boolean,
  type: String,
  value: String
})

const biAttributesModel = mongoose.model(collectionName, biAttributesSchema)

module.exports = biAttributesModel