vals <- c(88,35,66,69,53,32,13,39,21,20,80,86,54,26,41,53,56,32,44,44)
Topic<-c('Jobs','Business','Families','Women','Economy','Leadership','Government','Tax','Better','Success','Jobs','Business','Families','Women','Economy','Leadership','Government','Tax','Better','Success')
Party<-c('Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Democrats','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans','Republicans')
df<-data.frame(vals,Topic,Party)

ggplot(df, aes(x=Topic, y=vals, fill = Party)) +
  geom_bar( position = "dodge", stat="identity") +
  geom_text(aes(label=paste(vals,'%', sep = "")), group=Party, position = position_dodge(width = .9), size = 4.25, vjust = 1.5) +
  scale_fill_manual(values=c("#70a9ff","#ff707a")) +
  labs(y = '% To Whom is an Issue', title = 'Party Specific Proportions of People to Whom Certain Topics are an Issue') 
