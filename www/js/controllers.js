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

  $scope.types = ['Repair', 'Maint', 'Storm']; 

  $scope.data.chartData = Charts.getchartData();
  $scope.data.chartOptions = Charts.getchartOptions();
  $scope.data.lineChart = Charts.getlineChart();

  $scope.addItem = function () {
    $scope.newItem = {"Year" : "2014", "Type":"", "Total": 0, "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0, 
      "Jul":0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0 };

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
        parseInt(item.Jan) + parseInt(item.Feb) + parseInt(item.Mar) +
        parseInt(item.Apr) + parseInt(item.May) + parseInt(item.Jun) +
        parseInt(item.Jul) + parseInt(item.Aug) + parseInt(item.Sep) +
        parseInt(item.Oct) + parseInt(item.Nov) + parseInt(item.Dec);

      
      
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
      "Jan": $scope.getTotal('Jan'), "Feb": $scope.getTotal('Feb'), "Mar": $scope.getTotal('Mar'), 
      "Apr": $scope.getTotal('Apr'), "May": $scope.getTotal('May'), "Jun": $scope.getTotal('Jun'), 
      "Jul":$scope.getTotal('Jul'), "Aug": $scope.getTotal('Aug'), "Sep": $scope.getTotal('Sep'), 
      "Oct": $scope.getTotal('Oct'), "Nov": $scope.getTotal('Nov'), "Dec": $scope.getTotal('Dec'), 
      "Total": $scope.getTotal('Total') };

      $scope.updateLineChart($scope.totals);
  };

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

    
});
