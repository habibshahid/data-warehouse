// server/controllers/sectionDataController.js
const moment = require('moment');
const { parseAdvancedFilters } = require('../utils/advancedFilterParser');
const { dbConnections } = require('../models');

// Table mapping for different time intervals
const tableMapping = {
  '15min': 'yovo_tbl_call_center_stats_15_min',
  '30min': 'yovo_tbl_contact_center_stats_half_hourly',
  'hourly': 'yovo_tbl_contact_center_stats_hourly',
  'daily': 'yovo_tbl_contact_center_stats_daily',
  'monthly': 'yovo_tbl_contact_center_stats_monthly',
  'yearly': 'yovo_tbl_contact_center_stats_yearly',
};


const makeCallCenterStats = async (flatData) => {

  let { columns: att, groupBy, modelType, visualizationType, timeInterval, query, attributes, } = flatData

  console.log(JSON.stringify(attributes))

  const array = type !== "card" ? attributes : [{ ...attributes }]

  const columns = array.map((attr) => {
    return attr?.formula
  }).join(", ");

  let table = null;
  let selectClause = ""
  let where = query.filters ? " AND " + query.filters : "";
  let groupKey = "";
  groupKey = Array.isArray(groupBy) && groupBy.length > 0 ? "," + groupBy.map(item => {
    selectClause = selectClause + `,${ item.dbCol } AS ${ item.label }`
    return item.dbCol
  }).join(',') : ''

  if (timeInterval === '15min') {
    table = 'yovo_tbl_call_center_stats_15_min'
    groupKey = 'timeInterval, intervalType' + groupKey
    where = `pKey BETWEEN '${ moment(query.start).format('YYYY-MM') }' AND '${ moment(query.end).format('YYYY-MM') }' AND timeInterval BETWEEN '${ moment(query.start).format('YYYY-MM-DD HH:00:00') }' AND '${ moment(query.end).format('YYYY-MM-DD HH:00:00') }'` + where
    selectClause = "timeInterval AS 'Time Interval', intervalType AS 'Interval Type'" + selectClause
  }
  else if (timeInterval === 'halfHour') {
    table = 'yovo_tbl_contact_center_stats_half_hourly'
    groupKey = 'timeInterval, intervalType' + groupKey
    selectClause = "timeInterval AS 'Time Interval', intervalType AS 'Interval Type'" + selectClause
    where = `pKey BETWEEN '${ moment(query.start).format('YYYY-MM') }' AND '${ moment(query.end).format('YYYY-MM') }' AND timeInterval BETWEEN '${ moment(query.start).format('YYYY-MM-DD HH:00:00') }' AND '${ moment(query.end).format('YYYY-MM-DD HH:00:00') }'` + where
  }
  else if (timeInterval === 'hourly') {
    table = 'yovo_tbl_contact_center_stats_hourly'
    groupKey = 'timeInterval' + groupKey
    selectClause = "timeInterval AS 'Time Interval'" + selectClause
    where = `pKey BETWEEN '${ moment(query.start).format('YYYY-MM') }' AND '${ moment(query.end).format('YYYY-MM') }' AND timeInterval BETWEEN '${ moment(query.start).format('YYYY-MM-DD HH:00:00') }' AND '${ moment(query.end).format('YYYY-MM-DD HH:00:00') }'` + where
  }
  else if (timeInterval === 'daily') {
    table = 'yovo_tbl_contact_center_stats_daily'
    where = `pKey BETWEEN '${ moment(query.start).format('YYYY-MM') }' AND '${ moment(query.end).format('YYYY-MM') }' AND timeInterval BETWEEN '${ moment(query.start).format('YYYY-MM-DD') }' AND '${ moment(query.end).format('YYYY-MM-DD') }'` + where
    groupKey = 'timeInterval' + groupKey
    selectClause = "timeInterval AS 'Time Interval'" + selectClause
  }
  else if (timeInterval === 'month') {
    table = 'yovo_tbl_contact_center_stats_monthly'
    where = `pKey BETWEEN '${ moment(query.start).format('YYYY-MM') }' AND '${ moment(query.end).format('YYYY-MM') }'` + where
    groupKey = 'pKey' + groupKey
    selectClause = "pKey AS 'Time Interval'" + selectClause
  }
  else if (timeInterval === 'year') {
    table = 'yovo_tbl_contact_center_stats_yearly'
    where = `timeInterval BETWEEN '${ moment(query.start).format('YYYY') }' AND '${ moment(query.end).format('YYYY') }'` + where
    groupKey = 'timeInterval' + groupKey
    selectClause = "timeInterval AS 'Time Interval'" + selectClause
  }

  const myQuery = type !== "card" ?
    `SELECT ${selectClause}, ${columns} FROM ${table} WHERE ${where} GROUP BY ${ groupKey }` :
    `SELECT ${columns} FROM ${table} WHERE ${where}`;

  try {

    const [results] = await dbConnections?.dwh?.sequelize.query(myQuery);
    console.log(results);

    return { success: true, data: results }
  }
  catch (error) {
    console.log(error, error.message)
    return { success: false, error: { message: error.message } }
  }
}

/**
 * Get section data based on filters and time interval
 */

exports.getSectionData = async (req, res) => {
  try {
    const {
      sectionId,
      timeInterval,
      startDate,
      endDate,
      columns = ['*'],
      filters = {},
      groupBy,
      advancedFilters = null,
      visualizationType,
      modelType
    } = req.body;

    // Validate parameters
    if (!timeInterval) {
      return res.status(400).json({ success: false, error: { message: 'Time interval is required' } });
    }

    let time = {
      "start": startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0)),
      "end": endDate ? new Date(endDate) : new Date(),
      filters: !!filters ? JSON.parse(filters) : null
    }

    const makeStats = async () => {
      if (modelType === "agentJournal") {
        // return makeAgentData({ attributes, query, group, model, type, timeInterval })
      }
      else if (modelType === "contactCenter") {
        return makeCallCenterStats({ columns, groupBy, modelType, visualizationType, timeInterval })
      }
      else if (modelType === "agentPresence") {
        // return makeAgentData({ attributes, query, group, model, type, timeInterval })
      }
      else if (modelType === "workCodes") {
        // return makeWorkCodesData({ attributes, query, group, model, type, timeInterval })
      }
      else if (modelType === "feedbackStats") {
        // return makeFeedbackData({ attributes, query, group, model, type, timeInterval })
      }
    }

    res.json({
      success: true,
      data: results,
      sectionId,
      timeInterval,
      query: {
        timeInterval,
        startDate,
        endDate,
        columns,
        filters,
        groupBy,
        advancedFilters,
        visualizationType
      }
    });
  }
  catch (error) {
    console.error('Error fetching section data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch section data',
      message: error.message
    });
  }
};