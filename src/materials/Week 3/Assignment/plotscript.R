vals <- c(444,450,366,360,348,395,372,356,281,398,403,484, 182000,190000,157000,155000,170000,175000,170000,164000,117000,177000,178000,217000)
Month<-c('Jan','Feb','Mar',"Apr",'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar',"Apr",'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')
Measurement<-c('# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','# of Orders','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue','Revenue')

df<-data.frame(vals,Month,Measurement)

df<- df%>%
  group_by(Measurement) %>%
  mutate(mns = mean(vals)) %>%
  mutate(pct = (vals/mns - 1) * 100) %>%
  mutate(bar = 50*((pct/100)+1))


ggplot(df, aes(x=Month, y = pct)) +
  geom_bar(aes(fill = Measurement), position = "dodge", stat="identity") +
  scale_x_discrete(limits=c('Jan','Feb','Mar',"Apr",'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec')) +
  geom_text(aes(x=Month, y= pct,label=paste(round(pct,1),'%', sep = ""), group=Measurement, vjust = ifelse(pct >= 0, -.5, 1.5)), position = position_dodge(width = .9), size = 3) +
  labs(y = '% Above or Below Respective Yearly Mean', title = '2014 Monthly Sales Trends') 
