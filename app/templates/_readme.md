<%= siteName %>
<%= _.reduce(siteName, function(memo, ch){return memo + '='}, '') %>
<%= _.reduce(siteName, function(memo, ch){return memo + '-'}, '') %>
