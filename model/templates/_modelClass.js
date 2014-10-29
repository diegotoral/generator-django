
class <%= className %>(django.db.models.Model):
<% _.each(fields, function(field) { %>  <%= field.asString %>
<% }) %>
  def __unicode__(self):
    <% if(unicode !== 'pass'){ %>return <% } %><%= unicode %>
