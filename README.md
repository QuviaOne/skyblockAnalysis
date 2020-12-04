# Skyblock Analysis
Scripts that help you analyze the market of Hypixel Skyblock 

### Scripts
>### Quick stat
>**./quickStat.js** script is for *real-time* analysis of bazaar prices.  
> - You can run this script using the following command:  
**node ./quickStat.js** [BAZAAR_ID_OF_THE_ITEM]
> - This script only gives you basic *real-time* or *short-span* info. 
> - Time and treshold constants are available at the top of the file.

>### Bazaar stat
>**./bazaarStat.js** script is for *long-term* analysis of bazaar all prices.  
> - You can run this script using the following command:  
**node ./bazaarStat.js**
> - This script is work in progress

>### Discord bot
>**./discord.js** script that sets up a simple discord bot for you
> - You can run this script using the following command:  
**node ./discord.js** [DICSORD_TOKEN_FOR_THE_BOT] [PREFIX_FOR_COMMANDS]
> - This script is work in progress
>  #### Commands
> > #### Bazaar Flips
> > - Run this command simply by writing [PREFIX_FOR_COMMANDS]bazaarFlip
> > - Create a message, that will update itself by writing [PREFIX_FOR_COMMANDS]bazaarFlip [UPDATE_INTERVAL_IN_SECONDS]
> > - Use blacklist for items you don't want to be shown as possible flips using [PREFIX_FOR_COMMANDS]bazaarFlip blacklist
> >   - Use **blacklist add**[BAZAAR_ID_OF_THE_ITEM] to ad an item to the blacklist 
> >   - Use **blacklist remove**[BAZAAR_ID_OF_THE_ITEM] to remove an item from the blacklist 
> >   - Use **blacklist** to write the blacklist 
