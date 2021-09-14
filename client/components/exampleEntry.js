import React from 'react'
import { makeStyles } from '@material-ui/styles'
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
        <div contentEditable="true">
            <time datetime="2021-07-03 20:00">July 3, 2021</time>
            <p>
            Haenyeo (also spelled haenyo) (Hangul: 해녀; lit. "sea women") are female divers in the Korean province 
            of Jeju. whose livelihood consists of harvesting a variety of mollusks, seaweed, and other sea life from
            the ocean. Known for their independent spirit, iron will and determination, haenyeo are representative of 
            the semi-matriarchal family structure of Jeju. </p>

            <AdjustableImage className="test-image" src="/images/test/tree.jpg" />
            
            <p> Jeju's diving tradition dates back to 434 AD.[2]:100 Originally, diving was an exclusively male profession,
            with the exception of women who worked alongside their husbands.[2]:101 The first mention of female divers 
            in literature does not come until the 17th century, when a monograph of Jeju geography describes them as 
            jamnyeo (literally "diving women").[2]:101 </p>
            
            <img className="test-image" src="/images/test/flower.jpg"></img>

            <p> By the 18th century, female divers, at this point commonly referred to as haenyeo, outnumbered male 
            divers.[3]:1 Several possible explanations exist for this shift. For instance, in the 17th century, 
            a significant number of men died at sea due to war or deep-sea fishing accidents, meaning that diving became
            the work of women.[1]:1[4] Another explanation is that physiologically, women have more subcutaneous 
            fat and a higher shivering threshold than men, making them more equipped to withstand cold waters.[2]:101 
            An 18th century document records that taxes of dried abalone were imposed on ordinary people, forcing many
            women to dive in cold waters while pregnant.[4] </p>

            <img className="test-image" src="/images/test/temple.jpg"></img>
            
            <p>As sea diving became a female-dominated industry, many of the haenyeo subsequently replaced
            their husbands as the primary laborer.[3][5][6] This trend was especially prominent after the Japanese 
            colonized Korea in 1910 and diving became much more lucrative.[7] Up until this point, much of what the 
            haenyeo harvested was given to the Joseon government as tribute.[7] When the Japanese took over, however, 
            they abolished this tradition, allowing haenyeo to sell their catch at market and make a profit.[7]
            Additionally, Japanese and Korean merchants hired haenyeo to work for them in Japan and on the Korean 
            mainland as wage-laborers, increasing their financial situations greatly. On Yeonpyeong-ri, an island near 
            Incheon where many haenyeo worked, their wages, on average, constituted 40 to 48 percent of a typical family's 
            total income.[7] The prominent place of haenyeo in Jeju's economy and in their individual family units 
            continued long after Japanese colonization. In the early 1960s, for example, haenyeo harvests accounted 
            for 60% of Jeju's fisheries revenue, and 40% of haenyeo husbands remained unemployed.[2][5]
            </p>
        </div>
    )
}