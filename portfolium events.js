prev_event = time = "";
margin = eventPos = prevEvent = prevOppositeEvent = 0;
side = "left";
today = new Date();
global_events = [];

//Ready
$(document).ready(function(){

  function addEvent(events){
    $.each(events, function(index){
      time = (this.future ? "future" : "past");
      var cur_event = this;

      $.each(global_events, function(index){
        if(cur_event.begin_date <= this.begin_date)
          eventPos = index;
      });

      // Add event to eventPos index
      global_events.splice(eventPos, 0, cur_event);
      organizeEvents(cur_event);

    });
  };

  function organizeEvents(event){
    var elementIndex = 0;
    // Always add do left side if there's no space at right?
    if(0)
      side = (side == "left" ? "right" : "left");

    // Last position                 Last position in future
    // if(!eventPos || global_events[eventPos-1].future !== global_events[eventPos+1].future){
      // If not empty
      // if(global_events.length - 1){
      // If there is available space add to left
      if(checkSpace()){
        event.side = side;
        if(!prevEvent){
          // if elem right.length == 0 appendTo
          if(!$("#"+time+" .events."+event.side).children().length)
            createEventElement(event).css("display", "").appendTo("#"+time+" .events."+event.side);
          else{
            // insertBefore index 1
            createEventElement(event).css("display", "").insertBefore(
              $($("#"+time+" .events."+event.side).children()[0]));
          }
        }
        else{
          elementIndex = getEventsCount(
            global_events.slice(eventPos, global_events.length),
          event.side);
          createEventElement(event).css("display", "").insertAfter(
            $($("#"+time+" .events."+event.side).children()[elementIndex]));
        }
      }
      else{
        event.side = (side == "left" ? "right" : "left");
        if(!prevOppositeEvent){
            // if elem right.length == 0 appendTo
          if(!$("#"+time+" .events."+event.side).children().length)
            createEventElement(event).css("display", "").appendTo("#"+time+" .events."+event.side);
          else{
            // insertBefore index 1
            createEventElement(event).css("display", "").insertBefore(
              $($("#"+time+" .events."+event.side).children()[0]));
          }
        }
        else{
          elementIndex = getEventsCount(
            global_events.slice(eventPos, global_events.length),
          event.side);
          createEventElement(event).css("display", "").insertAfter(
            $($("#"+time+" .events."+event.side).children()[elementIndex]));
        }
      }

    // }
    // if(side=="left"){
      // var eltemp = $('#events_box_left').clone();
    //   $(eltemp).css("display", "").appendTo("#"+time+" .events.left");
    // }
    // else{
      // var eltemp = $('#events_box_right').clone();
    //   $(eltemp).css("display", "").appendTo("#"+time+" .events.right");
    // }
    

    // position += $(eltemp).height() + (cur_event.image ? ($(eltemp).find('img').last().height() < 40 ? cur_event.imageHeight.height : 0) :
                                       // 0) + parseInt($(eltemp).css("margin-top"));
    // position += $(eltemp).height() + parseInt($(eltemp).css("margin-top"));

    // if(position >= limit || limit - position < 20){
    //   side = (side == "left" ? "right" : "left");
    //   margin = (limit ? (position - limit) : 80);
    //   if(margin > 100)
    //     margin = 80;
    //   else if(margin < 20)
    //     margin = 50;
    //   limit = position - limit;
    //   if(time == "future"){
    //     $(".events.center .event_line_future").css("height", line+130);
    //     $(".events.center hr").css("display","");
    //     line = 0;
    //     time = "past"; 
    //     margin +=50;
    //   }
    //   line += limit;
    //   position = 0;
    // }
    // else{
    //   margin = 50;
    // }
  }

  // Check if there's space to add an event on the same side
  function checkSpace(){
    prevEvent = getPrevEventIndex();
    prevOppositeEvent = getPrevOppositeEventIndex();
    var oppSide = (side == "left" ? "right" : "left");

    if(global_events[eventPos].future){
      var prevEventsCount = getEventsCount(
        global_events.slice(
          (prevEvent !== false && prevOppositeEvent !== false ? prevEvent : getLastPastEvent() +1),
          global_events.length
        ),
      side);
      var prevOppositeEventsCount = getEventsCount(
        global_events.slice(
          (prevEvent !== false && prevOppositeEvent !== false ? prevOppositeEvent : getLastPastEvent() +1),
          global_events.length
        ),
      oppSide);
    }
    else{
      var prevEventsCount = getEventsCount(
        global_events.slice(
          (prevEvent !== false && prevOppositeEvent !== false ? prevEvent : 0),
          getLastPastEvent()
        ),
      side);
      var prevOppositeEventsCount = getEventsCount(
        global_events.slice(
          (prevEvent !== false && prevOppositeEvent !== false ? prevOppositeEvent : 0),
          getLastPastEvent()
        ),
      oppSide);
    }

    // If height of opposite side since previous event is bigger than
    // the height of same side since previous event than add event to same side
    var totalHeightLeft = 0;
    var totalHeightRight = 0;
    $("#"+time+" .events."+side+" #events_box_"+side).slice(0, prevEventsCount).each(function(index, el) {
      totalHeightLeft += $(el).height(); //+ margins?
    });
    $("#"+time+" .events."+oppSide+" #events_box_"+oppSide).slice(0, prevOppositeEventsCount).each(function(index, el) {
      totalHeightRight += $(el).height(); //+ margins?
    });

    // if(totalHeightLeft == totalHeightRight){
    //   $("#"+time+" .events."+side+" #events_box_"+side).each(function(index, el) {
    //     totalHeightLeft += $(el).height();
    //   });
    //   $("#"+time+" .events."+oppSide+" #events_box_"+oppSide).each(function(index, el) {
    //     totalHeightRight += $(el).height(); //+ margins?
    //   });

    //   if(totalHeightLeft > totalHeightRight)
    //     return false;
    //   return true
    // }
    // else 
    if(totalHeightLeft > totalHeightRight)
      return false;
    return true;
  }

  function getEventsCount(events, side){
    return events.filter(function(object){
      return object.side==side;
    }).length;
  }

  function getLastPastEvent(){
    var lastPast = "";
    global_events.forEach(function(el, index) {
      if(!el.future)
        lastPast = index;
    });
    if(lastPast)
      return lastPast;
    else
      return 0; // Returns false if there's no past event
  }

  // Get previous event on same side
  function getPrevEventIndex(){
    i=1;
    while(!!global_events[eventPos+i]){
      if(global_events[eventPos+i].future == global_events[eventPos].future &&
         global_events[eventPos+i].side === global_events[eventPos].side)
        return eventPos+i;
      i++;
    }
    return false;
  }

  // Get previous event on opposite side
  function getPrevOppositeEventIndex(){
    i=1;
    while(!!global_events[eventPos+i]){
      if(global_events[eventPos+i].future == global_events[eventPos].future &&
         global_events[eventPos+i].side !== global_events[eventPos].side)
        return eventPos+i;
      i++;
    }
    return false;
  }

  function createEventElement(event){
    var eltemp = $('#events_box_'+event.side).clone();
    
    // Margin between events
    $(eltemp).css("margin-top", margin + "px");

    // Event details
    $(eltemp).find(".event_title").text(event.title);
    $(eltemp).find(".event_date").text(event.begin_date.toDateString());
    $(eltemp).find(".event_description").text(event.description);
    if(!event.image)
      $(eltemp).find('img').last().css("display", "none");
    else
      $(eltemp).find('img').last().attr('src', event.image);

    return $(eltemp);
  }
  
  $(".menu form").on("submit", function(event) {
    // Prevents the form from being submited
    event.preventDefault();
    var errors = [];

    $("#errors").slideUp(); // Hide errors

    if(!this.title.value)
      errors.push("Event title cannot be empty.");
    if(!this.begin_date.value)
      errors.push("Invalid begin date.");
    else if(new Date(this.begin_date.value) > new Date(this.end_date.value)){
      errors.push("Begin date can't be higher than end date.");
    }

    if(!errors.length){
      event = [
        {
          future: (new Date(this.begin_date.value) > today ? true : false),
          side: "left",
          title: this.title.value,
          begin_date: new Date(this.begin_date.value),
          end_date: new Date(this.end_date.value),
          description: this.description.value,
          image: false,
        }
      ];

      addEvent(event);
    }
    else{
      $("#errors").empty(); // Remove previous errors
      $.each(errors, function(index){ // Add errors
        $("#errors").append("<span>"+errors[index]+"</span>");
      });
      $("#errors").slideDown(); // Show errors
    }
  });

  addEvent([{
    future: true,
    side: "left",
    title: 'World Peace',
    begin_date: new Date(new Date(today).setDate(today.getDate() + 1)),
    end_date: new Date(new Date(today).setDate(today.getDate() + 1)),
    description: 'Make the world a better place!',
    image: false,
  }]);

});

