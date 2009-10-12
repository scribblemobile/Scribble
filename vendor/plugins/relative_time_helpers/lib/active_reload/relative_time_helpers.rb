module ActiveReload
  # see test cases for sample output
  module RelativeTimeHelpers
    mattr_accessor :time_class
    mattr_accessor :time_output
    
    self.time_class = Time
    self.time_output = {
      :today          => 'time_ago_in_words',
      :yesterday      => '%a',
      :tomorrow       => 'tomorrow',
      :initial_format => '%b %d',
      :year_format    => ', %Y'
    }

    def relative_date(time)
      date  = time.to_date
      today = time_class.now.to_date
      
      if date > (today - 1)
        timeago = time_ago_in_words(time)
        if timeago.include?('minutes') or timeago.include?('minute')
          timeago = '< 1 hr'
        else
          timeago.gsub('hours','hrs')
          timeago.gsub('hour','hr')
          timeago.gsub('about','~')
        end
        
      elsif date > (today - 7)
        fmt = time_output[:yesterday].dup
        time.strftime_ordinalized(fmt)
      else
        fmt  = time_output[:initial_format].dup
        #fmt << time_output[:year_format] unless date.year == today.year
        time.strftime_ordinalized(fmt)
      end
    end
    
    def relative_date_span(times)
      times = [times.first, times.last].collect!(&:to_date)
      times.sort!
      if times.first == times.last
        relative_date(times.first)
      else
        first = times.first; last = times.last; now = time_class.now
        [first.strftime_ordinalized('%b %d')].tap do |arr|
          arr << ", #{first.year}" unless first.year == last.year
          arr << ' - '
          arr << last.strftime('%b') << ' ' unless first.year == last.year && first.month == last.month
          arr << last.day.ordinalize
          arr << ", #{last.year}" unless first.year == last.year && last.year == now.year
        end.to_s
      end
    end
    
    def relative_time_span(times)
      times = [times.first, times.last].collect!(&:to_time)
      times.sort!
      if times.first == times.last
        "#{prettier_time(times.first)} #{relative_date(times.first)}"
      elsif times.first.to_date == times.last.to_date
          same_half = (times.first.hour/12 == times.last.hour/12)
          "#{prettier_time(times.first, !same_half)} - #{prettier_time(times.last)} #{relative_date(times.first)}"

      else
        first = times.first; last = times.last; now = time_class.now        
        [prettier_time(first)].tap do |arr|
          arr << ' '
          arr << first.strftime_ordinalized('%b %d')
          arr << ", #{first.year}" unless first.year == last.year
          arr << ' - '
          arr << prettier_time(last)
          arr << ' '
          arr << last.strftime('%b') << ' ' unless first.year == last.year && first.month == last.month
          arr << last.day.ordinalize
          arr << ", #{last.year}" unless first.year == last.year && last.year == now.year
        end.to_s
      end
    end
    
    def prettier_time(time, ampm=true)
      time.strftime("%I:%M#{" %p" if ampm}").sub(/^0/, '')
    end
  end
end