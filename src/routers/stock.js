module.exports = (app) => {
    const stock=require('../controller/stock')
  
    app.get('/dashboard',stock.getDashboardData)
    app.get('/cron',stock.fetchDataAndSave)
    app.get('/:id',stock.getStockData);
  
}