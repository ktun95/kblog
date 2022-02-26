import React from 'react'
import { makeStyles } from '@mui/styles'
import { AdjustableImage } from '.'
// import { createEntryObject, Entry } from '../interfaces/entry'

const useStyles = makeStyles({
    testImage: {
        // width: "100%",
        // height: "auto"
    }
})

export const ExampleEntry = () => {
    return (
        <div>
            <p>
            Hello! Welcome to the demo of my blogging app. This app is currently best viewed on a mobile device or by using
            device emulation from the developer tools. To begin, please open the map above and click/tap on one of the markers to 
            select a blog entry. Once an entry has been selected, you may edit the currently selected entry by using the menu on the
            top left. From this menu, you may also create a new blog entry.  -Kevin</p>

            <img className="test-image" src="/images/test/tree.jpg"></img>
            
            <p> Jeju's diving tradition dates back to 434 AD. Originally, diving was an exclusively male profession,
            with the exception of women who worked alongside their husbands. The first mention of female divers 
            in literature does not come until the 17th century, when a monograph of Jeju geography describes them as 
            jamnyeo (literally "diving women"). </p>
            
            <img className="test-image" src="/images/test/flower.jpg"></img>

            <p> By the 18th century, female divers, at this point commonly referred to as haenyeo, outnumbered male 
            divers. Several possible explanations exist for this shift. For instance, in the 17th century, 
            a significant number of men died at sea due to war or deep-sea fishing accidents, meaning that diving became
            the work of women. Another explanation is that physiologically, women have more subcutaneous 
            fat and a higher shivering threshold than men, making them more equipped to withstand cold waters. 
            An 18th century document records that taxes of dried abalone were imposed on ordinary people, forcing many
            women to dive in cold waters while pregnant. </p>

            <img className="test-image" src="/images/test/temple.jpg"></img>
            
            <p>As sea diving became a female-dominated industry, many of the haenyeo subsequently replaced
            their husbands as the primary laborer. This trend was especially prominent after the Japanese 
            colonized Korea in 1910 and diving became much more lucrative. Up until this point, much of what the 
            haenyeo harvested was given to the Joseon government as tribute. When the Japanese took over, however, 
            they abolished this tradition, allowing haenyeo to sell their catch at market and make a profit.
            Additionally, Japanese and Korean merchants hired haenyeo to work for them in Japan and on the Korean 
            mainland as wage-laborers, increasing their financial situations greatly. On Yeonpyeong-ri, an island near 
            Incheon where many haenyeo worked, their wages, on average, constituted 40 to 48 percent of a typical family's 
            total income. The prominent place of haenyeo in Jeju's economy and in their individual family units 
            continued long after Japanese colonization. In the early 1960s, for example, haenyeo harvests accounted 
            for 60% of Jeju's fisheries revenue, and 40% of haenyeo husbands remained unemployed.
            </p>
        </div>
    )
}