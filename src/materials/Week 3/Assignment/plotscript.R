vals <- c(88,35,66,69,53,32,13,39,21,20,80,86,54,26,41,53,56,32,44,44)
Topic<-c('Jobs','Business','Families','Women','Economy','Leadership','Government','Tax','Better','Success','Jobs','Business','Families','Women','Economy','Leadership','Government','Tax','Better','Success')
Party<-c('Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans')
df<-data.frame(vals,Party,Party)

ggplot(df, aes(x=Topic, y=vals, fill = Party)) +
  geom_bar( position = "dodge", stat="identity") +
  geom_text(aes(label=paste(vals,'%', sep = "")), group=Party, position = position_dodge(width = .9), size = 5, vjust = 1.5) +
  scale_fill_manual(values=c("#70a9ff","#ff707a")) 


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

#bcd6ff
#ffbcc1