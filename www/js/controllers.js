angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $stateParams, $filter, Charts, ItemsService) {

  $scope.data = {};
 
  $scope.accountId = $stateParams.accountId;

  $scope.items = ItemsService.getItems($stateParams.accountId);

  $scope.totals = {};

  $scope.types = ['Q3-14', 'Q2-14', 'Q1-14', 'Q4-13']; 

  $scope.data.chartData = Charts.getchartData();
  $scope.data.chartOptions = Charts.getchartOptions();
  $scope.data.lineChart = Charts.getlineChart();

  $scope.addItem = function () {
    $scope.newItem = {"Year" : "2014", "Type":"", "Total": 0, "Devices": 0, "Categories": 0, "Locations": 0, "Calls": 0, "AdvEvents": 0, "TTR": 0, 
      "CustSat":0};

    //ItemsService.addItem(angular.copy($scope.newItem));
    ItemsService.addItem($scope.newItem);
    
  };

  $scope.getTotal = function(column){
    var total = 0;
    for(var i = 0; i < $scope.items.length; i++){
        var item = $scope.items[i];
        total += parseInt(item[column]);
    }
    return total;
  }

  $scope.updateItem = function (index, column) {
      //$scope.items[id].AccountId = $scope.accountId;
      //Update row total before doing update 
      var item = $scope.items[index];
      item.Total = 
        parseInt(item.Devices) + parseInt(item.Categories) + parseInt(item.Locations) +
        parseInt(item.Calls) + parseInt(item.AdvEvents) + parseInt(item.TTR) +
        parseInt(item.CustSat);

      
      
      ItemsService.updateItem(index);

      //Update total for this column and grand totals 
      $scope.totals[column] = $scope.getTotal(column);  

      $scope.totals["Total"] = $scope.getTotal("Total");


      //Update Donut Chart entry 
      _.find($scope.data.chartData, { 'label': item.Type }).value = item.Total;

      //Update Line Chart Entry 
      $scope.updateLineChart();
      
  };

  $scope.removeItem = function (index) {
      //remove from charts before updating array 
      var item = $scope.items[index];
      item.Total = 0; 
      $scope.updateDonutChart(item.$id);
      ItemsService.removeItem(index);
  };

  $scope.updateTotals = function(){
    //Load Totals 
      $scope.totals = {"Year" : "2014", "Type":"",  
      "Devices": $scope.getTotal('Devices'), "Categories": $scope.getTotal('Categories'), "Locations": $scope.getTotal('Locations'), 
      "Calls": $scope.getTotal('Calls'), "AdvEvents": $scope.getTotal('AdvEvents'), "TTR": $scope.getTotal('TTR'), 
      "CustSat":$scope.getTotal('CustSat'), 
      "Total": $scope.getTotal('Total') };

      $scope.updateLineChart($scope.totals);
  };

  /* Disable charts for now 

  $scope.updateLineChart = function(){
      var t = $scope.totals; 
      $scope.data.lineChart.datasets[0].data = [t.Jan, t.Feb, t.Mar, t.Apr, t.May, t.Jun, t.Jul, t.Aug, t.Sep, t.Oct, t.Nov, t.Dec];
  }

  $scope.updateDonutChart = function(id){
      //Load Chart elements
      item = _.find($scope.items,{'$id' : id});
      if(item.Type){
        _.find($scope.data.chartData, { 'label': item.Type }).value = item.Total;  
      }
  };


  $scope.items.$watch(function(context) {
    if(context.event == "child_added") { 
      $scope.updateTotals();
      $scope.updateDonutChart(context.key);
    }
    else if (context.event == "child_removed"){
      $scope.updateTotals();
    }
  });
  
  */
    
});
