//여기부터 구역 오버레이
        var areas = [
        {
            name : '신관 A동',
            path : [
                new daum.maps.LatLng(37.296704968860624, 126.97265256324391),
                new daum.maps.LatLng(37.29690979382814, 126.97196450141166),
                new daum.maps.LatLng(37.29682191460552, 126.97184611005511),
                new daum.maps.LatLng(37.29673406617434, 126.97185742125625),
                new daum.maps.LatLng(37.2965785549857, 126.97151348685938),
                new daum.maps.LatLng(37.29620235704303, 126.97145159762604),
                new daum.maps.LatLng(37.29602692537724, 126.97259641693125),
                new daum.maps.LatLng(37.2962250951866, 126.97234540099207),
                new daum.maps.LatLng(37.296360251416225, 126.97234817111507),
                new daum.maps.LatLng(37.29638054907893, 126.97245248895516),
                new daum.maps.LatLng(37.296373805066956, 126.97251170304891)],
            center : new daum.maps.LatLng(37.29656291056642,126.9720323007584)
        },
        {
            name : '신관 왼쪽',
            path : [
                new daum.maps.LatLng(37.29658756467791, 126.97151066385224),
                new daum.maps.LatLng(37.29661889154948, 126.9706534903612),
                new daum.maps.LatLng(37.29633053586964, 126.97055773598099),
                new daum.maps.LatLng(37.29619109339872, 126.97144878228792),
                new daum.maps.LatLng(37.2965785549857, 126.97151348685938)],
            center : new daum.maps.LatLng(37.29647482696954, 126.97106520871584)
        },
        {
            name : '대운동장',
            path : [
                new daum.maps.LatLng(37.29633053586964, 126.97055773598099),
                new daum.maps.LatLng(37.29560965828155, 126.97036628596368),
                new daum.maps.LatLng(37.29422653626754, 126.97024840859957),
                new daum.maps.LatLng(37.29413222587683, 126.97146083846559),
                new daum.maps.LatLng(37.295821721003996, 126.97166884921043),
                new daum.maps.LatLng(37.29607414637932, 126.97223831181391)],
            center : new daum.maps.LatLng(37.29522913476928, 126.97103185113161)
        },
        {
            name : '축구장',
            path : [
                new daum.maps.LatLng(37.294237798526744, 126.97024558464248),
                new daum.maps.LatLng(37.292859189795344, 126.9701615434723),
                new daum.maps.LatLng(37.292760364156194, 126.97132884174466),
                new daum.maps.LatLng(37.29412099749306, 126.97160463810239)],
            center : new daum.maps.LatLng(37.293724357306424,126.97084916044457)
        },
        {
            name : '학군단+우체국',
            path : [
                new daum.maps.LatLng(37.2938191370707, 126.9715511809384),
                new daum.maps.LatLng(37.29372469677456, 126.97226173119748),
                new daum.maps.LatLng(37.29350859537792, 126.97289901634265),
                new daum.maps.LatLng(37.29348162974963, 126.97318661437316),
                new daum.maps.LatLng(37.29523872261613, 126.97349614225901),
                new daum.maps.LatLng(37.29574771449301, 126.97307866610024),
                new daum.maps.LatLng(37.29568913166175, 126.97301101715107),
                new daum.maps.LatLng(37.29602241953844, 126.97259359897726),
                new daum.maps.LatLng(37.29607189643125, 126.97224959100222),
                new daum.maps.LatLng(37.295828478783, 126.97166884667607),
                new daum.maps.LatLng(37.29413898501734, 126.9714664749487),
                new daum.maps.LatLng(37.29411649298212, 126.97160745931284)],
            center : new daum.maps.LatLng(37.29459873146583,126.97238265030688)
        },
        {
            name : '체육관',
            path : [
                new daum.maps.LatLng(37.29286144381089, 126.97016718152317),
                new daum.maps.LatLng(37.291996434805725, 126.9701167731897),
                new daum.maps.LatLng(37.29212056494911, 126.97107251523396),
                new daum.maps.LatLng(37.292767091823286, 126.97120478264264)],
            center : new daum.maps.LatLng(37.29256197141895,126.97065788570286)
        },
        {
            name : '체육관옆 주차장',
            path : [
                new daum.maps.LatLng(37.292767091823286, 126.97120478264264),
                new daum.maps.LatLng(37.29211831304373, 126.97107533553894),
                new daum.maps.LatLng(37.29184830033844, 126.97232444761218),
                new daum.maps.LatLng(37.29211862287488, 126.97237227912082),
                new daum.maps.LatLng(37.29219065833922, 126.97216925270226),
                new daum.maps.LatLng(37.29273127964678, 126.97216341462628),
                new daum.maps.LatLng(37.29283019867183, 126.97134573205959),
                new daum.maps.LatLng(37.292758111562016, 126.97132884259959)],
            center : new daum.maps.LatLng(37.29214803430012,126.97292487937636)
        },
        {
            name : '야구장',
            path : [
                new daum.maps.LatLng(37.291991931040336, 126.97012241384722),
                new daum.maps.LatLng(37.291023298250245, 126.97005513123322),
                new daum.maps.LatLng(37.29092422107707, 126.97020177920847),
                new daum.maps.LatLng(37.29078095819642, 126.97403621007072),
                new daum.maps.LatLng(37.29183972823175, 126.97426703969616),
                new daum.maps.LatLng(37.29197455478773, 126.97279524742041),
                new daum.maps.LatLng(37.29181686409148, 126.97275583215772),
                new daum.maps.LatLng(37.29184830099766, 126.97232726704469),
                new daum.maps.LatLng(37.29211831166563, 126.97106969665386)],
            center : new daum.maps.LatLng(37.29137289184392,126.97185377944646)
        },
        {
            name : '수성관',
            path : [
                new daum.maps.LatLng(37.29382138830898, 126.97154554107796),
                new daum.maps.LatLng(37.29283019798922, 126.97134291259047),
                new daum.maps.LatLng(37.29262335680978, 126.97303466804495),
                new daum.maps.LatLng(37.29348162974979, 126.97318661437308),
                new daum.maps.LatLng(37.29350633890937, 126.97288210018438),
                new daum.maps.LatLng(37.29372244153725, 126.97225045401483)],
            center : new daum.maps.LatLng(37.29329217425049,126.97215756899301)
        },
        {
            name : '의학건물3',
            path : [
                new daum.maps.LatLng(37.292722270595995, 126.9721690568763),
                new daum.maps.LatLng(37.29219066099043, 126.97218053048334),
                new daum.maps.LatLng(37.29212312937981, 126.9723779163589),
                new daum.maps.LatLng(37.29184379580857, 126.97232726869477),
                new daum.maps.LatLng(37.29181686668676, 126.9727671098831),
                new daum.maps.LatLng(37.291981311923124, 126.97279242554966),
                new daum.maps.LatLng(37.29183972700573, 126.97426140083167),
                new daum.maps.LatLng(37.29246597395776, 126.97437960463353)],
            center : new daum.maps.LatLng(37.29239999671942,126.9715263402315)
        },
        {
            name : '기숙사 의관',
            path : [
                new daum.maps.LatLng(37.29744868301134, 126.97425103088113),
                new daum.maps.LatLng(37.29703891053236, 126.97518446692281),
                new daum.maps.LatLng(37.29649375701809, 126.97506058333734),
                new daum.maps.LatLng(37.29635162110362, 126.97402583675967)],
            center : new daum.maps.LatLng(37.296860821604845,126.97455293058366)
        },
        {
            name : '산학협력센터',
            path : [
                new daum.maps.LatLng(37.296493759394124, 126.97507186176118),
                new daum.maps.LatLng(37.29594411721011, 126.97502692976583),
                new daum.maps.LatLng(37.29577732564257, 126.97455893472468),
                new daum.maps.LatLng(37.29526382693231, 126.97499331992931),
                new daum.maps.LatLng(37.295435110277765, 126.97540491995802),
                new daum.maps.LatLng(37.2953766701269, 126.97602524316154),
                new daum.maps.LatLng(37.296210160319234, 126.97617723680133),
                new daum.maps.LatLng(37.296462302067695, 126.97544969920628)],
            center : new daum.maps.LatLng(37.296027611516244,126.97574025811434)
        },
        {
            name : '기숙사 예관',
            path : [
                new daum.maps.LatLng(37.297041164307124, 126.97519010543559),
                new daum.maps.LatLng(37.296390415187034, 126.97641402654843),
                new daum.maps.LatLng(37.296264284570334, 126.97648737546612),
                new daum.maps.LatLng(37.296210161454134, 126.9761828759921),
                new daum.maps.LatLng(37.296462302067695, 126.97544969920628),
                new daum.maps.LatLng(37.29650051598474, 126.97506622031872)],
            center : new daum.maps.LatLng(37.29663352071468,126.97555396918185)
        },
        {
            name : '제2공학관',
            path : [
                new daum.maps.LatLng(37.29621241234462, 126.97617441649551),
                new daum.maps.LatLng(37.294617519232055, 126.97589296588225),
                new daum.maps.LatLng(37.294401599510714, 126.97756783444687),
                new daum.maps.LatLng(37.29561353836945, 126.97779867958785),
                new daum.maps.LatLng(37.29626206602032, 126.97665937160373),
                new daum.maps.LatLng(37.29626653772336, 126.9764901943625)],
            center : new daum.maps.LatLng(37.295142581391616,126.97693603394502)
        },
        {
            name : '제1공학관',
            path : [
                new daum.maps.LatLng(37.2946197712512, 126.97589014562742),
                new daum.maps.LatLng(37.293475411513505, 126.9756846878006),
                new daum.maps.LatLng(37.29327750842527, 126.97732287291998),
                new daum.maps.LatLng(37.294399345848184, 126.97756219606009)],
            center : new daum.maps.LatLng(37.29393513372225,126.97664317345912)
        },
        {
            name : '제1공학주차장',
            path : [
                new daum.maps.LatLng(37.29348665823904, 126.97560573835159),
                new daum.maps.LatLng(37.29233778908469, 126.97538337266668),
                new daum.maps.LatLng(37.29215121451527, 126.97734012764106),
                new daum.maps.LatLng(37.2928540218024, 126.97732863897212),
                new daum.maps.LatLng(37.29286301811545, 126.97725533003593),
                new daum.maps.LatLng(37.29327750950551, 126.97732851189186)],
            center : new daum.maps.LatLng(37.29288538130643,126.97642357921953)
        },
        {
            name : '잔디',
            path : [
                new daum.maps.LatLng(37.293429818811404, 126.97318099377772),
                new daum.maps.LatLng(37.293380383166046, 126.97372235339202),
                new daum.maps.LatLng(37.293612492248926, 126.97413955845153),
                new daum.maps.LatLng(37.29344385662842, 126.97559447420251),
                new daum.maps.LatLng(37.29234004167913, 126.97538337193266),
                new daum.maps.LatLng(37.29262561068856, 126.97304030616404)],
            center : new daum.maps.LatLng(37.2930224109238,126.97459369615953)
        },
        {
            name : '정문+주차장+환경플랜트',
            path : [
                new daum.maps.LatLng(37.29078546647779, 126.97405030548701),
                new daum.maps.LatLng(37.29070014509219, 126.97534725415045),
                new daum.maps.LatLng(37.29063712617037, 126.97560665836819),
                new daum.maps.LatLng(37.29101564738801, 126.9760238076147),
                new daum.maps.LatLng(37.29141662181959, 126.9760857075401),
                new daum.maps.LatLng(37.29154258731094, 126.97521164705024),
                new daum.maps.LatLng(37.29175884230062, 126.97523977039477),
                new daum.maps.LatLng(37.29188478073619, 126.97426984378593)],
            center : new daum.maps.LatLng(37.29109881845437,126.97517514037878)
        },
        {
            name : '농구장',
            path : [
                new daum.maps.LatLng(37.29246146815878, 126.97437678670582),
                new daum.maps.LatLng(37.29188703333068, 126.97426984301876),
                new daum.maps.LatLng(37.29175884112093, 126.97523413153637),
                new daum.maps.LatLng(37.29234004167909, 126.97538337193264)],
            center : new daum.maps.LatLng(37.29204707917918,126.97478856550696)
        },
        {
            name : 'N센터+약학건물',
            path : [
                new daum.maps.LatLng(37.291015648530085, 126.97602944641773),
                new daum.maps.LatLng(37.291062972966216, 126.97612811052508),
                new daum.maps.LatLng(37.29109912853108, 126.97670043827863),
                new daum.maps.LatLng(37.29184026263224, 126.97685527851512),
                new daum.maps.LatLng(37.291815522518405, 126.97705264630208),
                new daum.maps.LatLng(37.292171446104916, 126.97712302432127),
                new daum.maps.LatLng(37.29233778849833, 126.97538055321574),
                new daum.maps.LatLng(37.29176559949466, 126.97523694875066),
                new daum.maps.LatLng(37.291540335306664, 126.97521446721032),
                new daum.maps.LatLng(37.29141887441435, 126.9760857068271)],
            center : new daum.maps.LatLng(37.29178381295072,126.97617581309002)
        },
        {
            name : '생명공학실습동',
            path : [
                new daum.maps.LatLng(37.294099739108546, 126.97750025567385),
                new daum.maps.LatLng(37.294027763003506, 126.97806981895974),
                new daum.maps.LatLng(37.293870127146015, 126.97831798144205),
                new daum.maps.LatLng(37.293771130030905, 126.97896649589669),
                new daum.maps.LatLng(37.29523971540957, 126.97837961867245),
                new daum.maps.LatLng(37.29560903318305, 126.97779868091187)],
            center : new daum.maps.LatLng(37.29463823049576, 126.9781485887841)
        },
        {
            name : '공학실습동',
            path : [
                new daum.maps.LatLng(37.29214445727149, 126.97734294911152),
                new daum.maps.LatLng(37.291987063332265, 126.9788993260616),
                new daum.maps.LatLng(37.29241960147523, 126.97912476158966),
                new daum.maps.LatLng(37.292928692765805, 126.97915281565732),
                new daum.maps.LatLng(37.29376662384084, 126.9789608581425),
                new daum.maps.LatLng(37.29387463026725, 126.9783067021161),
                new daum.maps.LatLng(37.29402326407988, 126.97810365443301),
                new daum.maps.LatLng(37.29410424322399, 126.97749461529854),
                new daum.maps.LatLng(37.29286977427243, 126.97724686958937),
                new daum.maps.LatLng(37.29285627493668, 126.97733145776638)],
            center : new daum.maps.LatLng(37.292908223773814,126.97807014392963)
        },
        {
            name : '반도체관+화학관',
            path : [
                new daum.maps.LatLng(37.29217144719466, 126.97712866321062),
                new daum.maps.LatLng(37.29182002716112, 126.97704982550225),
                new daum.maps.LatLng(37.29184251357268, 126.97684681952796),
                new daum.maps.LatLng(37.291094625560675, 126.97671171728578),
                new daum.maps.LatLng(37.29109920120449, 126.97707259969202),
                new daum.maps.LatLng(37.29113976208931, 126.9771458919486),
                new daum.maps.LatLng(37.29129761240153, 126.97803677846522),
                new daum.maps.LatLng(37.29126612702063, 126.97831308990075),
                new daum.maps.LatLng(37.29121210073938, 126.97851046404055),
                new daum.maps.LatLng(37.291996075720604, 126.97891060129781)],
            center : new daum.maps.LatLng(37.29163315483732,126.97753482332149)
        },
        {
            name : '학생회관',
            path : [
                new daum.maps.LatLng(37.29524322906529, 126.97350177979696),
                new daum.maps.LatLng(37.29444594946978, 126.97412799503698),
                new daum.maps.LatLng(37.293508833365564, 126.97395914627134),
                new daum.maps.LatLng(37.29338714470254, 126.97373926798132),
                new daum.maps.LatLng(37.29341855711919, 126.9731866367581)],
            center : new daum.maps.LatLng(37.29408318116908,126.97367135765238)
        },
        {
            name : '삼성학술정보관',
            path : [
                new daum.maps.LatLng(37.29438287438327, 126.97411673852834),
                new daum.maps.LatLng(37.2941669820941, 126.9758028850296),
                new daum.maps.LatLng(37.29348217045368, 126.97569032461274),
                new daum.maps.LatLng(37.293482154213216, 126.97561137879333),
                new daum.maps.LatLng(37.293446108059555, 126.97558883449042),
                new daum.maps.LatLng(37.293603484336856, 126.97415083952792),
                new daum.maps.LatLng(37.29351333731268, 126.97395350572909)],
            center : new daum.maps.LatLng(37.29402939554477,126.9749457967929)
        },
        {
            name : '학부대학',
            path : [
                new daum.maps.LatLng(37.296308752115365, 126.9737100563868),
                new daum.maps.LatLng(37.296243436934056, 126.97375519266608),
                new daum.maps.LatLng(37.29574771577553, 126.97308430525632),
                new daum.maps.LatLng(37.294432436372965, 126.97413927778145),
                new daum.maps.LatLng(37.294382876849056, 126.97412801663683),
                new daum.maps.LatLng(37.29417599362165, 126.97580852118259),
                new daum.maps.LatLng(37.29538793252204, 126.97602242002246),
                new daum.maps.LatLng(37.29543736579969, 126.97541901705723),
                new daum.maps.LatLng(37.29527058173278, 126.97497921989097),
                new daum.maps.LatLng(37.295784085239696, 126.97456739118716),
                new daum.maps.LatLng(37.29595087677365, 126.97503538628888),
                new daum.maps.LatLng(37.29649826517353, 126.9750746798805)],
            center : new daum.maps.LatLng(37.29518263679413,126.97453939809618)
        },
        {
            name : '신관 B동',
            path : [
                new daum.maps.LatLng(37.29670046302381, 126.97264974526139),
                new daum.maps.LatLng(37.296369300536256, 126.97251452428941),
                new daum.maps.LatLng(37.29638280101547, 126.97244966853198),
                new daum.maps.LatLng(37.29635799882358, 126.97234817193966),
                new daum.maps.LatLng(37.29622284259379, 126.9723454018167),
                new daum.maps.LatLng(37.295686879711646, 126.97301383753157),
                new daum.maps.LatLng(37.29624569140227, 126.9737636506734),
                new daum.maps.LatLng(37.29630650014887, 126.9737128767697),
                new daum.maps.LatLng(37.29682227333353, 126.97339690003034),
                new daum.maps.LatLng(37.29661942805414, 126.97290353957344)],
            center : new daum.maps.LatLng(37.296337861052145,126.97293465617312)
        },
        {
            name : '기숙사인관',
            path : [
                new daum.maps.LatLng(37.29744642980555, 126.97424821200755),
                new daum.maps.LatLng(37.29744185300398, 126.973921135152),
                new daum.maps.LatLng(37.29706565512484, 126.97385359396854),
                new daum.maps.LatLng(37.29682903111131, 126.97339689765029),
                new daum.maps.LatLng(37.29630875211548, 126.97371005638686),
                new daum.maps.LatLng(37.29635162172224, 126.97402865636019)],
            center : new daum.maps.LatLng(37.29683364679814,126.97389314893545)
        }

        ];  