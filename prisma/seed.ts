import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.college.upsert({
    where: { name: "통역번역전문대학원" },
    update: {},
    create: {
      name: "통역번역전문대학원",
      departments: {
        createMany: {
          data: [
            { name: "한일번역" },
            { name: "한일통역" },
            { name: "한중번역" },
            { name: "한중통역" },
            { name: "한영번역" },
            { name: "한영통역" },
          ],
        },
      },
    },
  });

  await prisma.user.createMany({
    data: [
      {
        departmentId: 1,
        email: "test@test.com",
        academicId: "2022000000",
        password:
          "$2a$10$nhCcDt91MQFAGnLvXVrPo.o6c/6UgCMZDaoWsIwDD.PvQB51WyENm",
        firstName: "화연",
        lastName: "이",
        isAdmin: false,
        role: "PROFESSOR",
      },
      {
        departmentId: 1,
        email: "test1@test.com",
        academicId: "2022000001",
        password:
          "$2a$10$nhCcDt91MQFAGnLvXVrPo.o6c/6UgCMZDaoWsIwDD.PvQB51WyENm",
        firstName: "이화1",
        lastName: "김",
        isAdmin: false,
        role: "STUDENT",
      },
      {
        departmentId: 1,
        email: "test2@test.com",
        academicId: "2022000002",
        password:
          "$2a$10$nhCcDt91MQFAGnLvXVrPo.o6c/6UgCMZDaoWsIwDD.PvQB51WyENm",
        firstName: "이화2",
        lastName: "김",
        isAdmin: false,
        role: "STUDENT",
      },
      {
        departmentId: 1,
        email: "test3@test.com",
        academicId: "2022000003",
        password:
          "$2a$10$nhCcDt91MQFAGnLvXVrPo.o6c/6UgCMZDaoWsIwDD.PvQB51WyENm",
        firstName: "이화3",
        lastName: "김",
        isAdmin: false,
        role: "STUDENT",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.course.createMany({
    data: [
      {
        departmentId: 1,
        year: 2022,
        semester: "SPRING",
        code: "TJ206",
        name: "문학번역I AB",
      },
      {
        departmentId: 1,
        year: 2022,
        semester: "SPRING",
        code: "TJ208",
        name: "문학번역I BA",
      },
      {
        departmentId: 2,
        year: 2022,
        semester: "SPRING",
        code: "KJ101",
        name: "순차통역I AB",
      },
      {
        departmentId: 2,
        year: 2022,
        semester: "SPRING",
        code: "KJ205",
        name: "동시통역I AB",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.feedbackCategory.createMany({
    data: [
      {
        name: "내용오역",
        isPrimary: true,
        feedbackCategoryType: "COMMON",
      },
      {
        name: "불필요한 첨가",
        isPrimary: true,
        feedbackCategoryType: "COMMON",
      },
      { name: "일관성 문제", isPrimary: true, feedbackCategoryType: "COMMON" },
      { name: "표현 어색", isPrimary: true, feedbackCategoryType: "COMMON" },
      { name: "칭찬", isPrimary: true, feedbackCategoryType: "COMMON" },
      {
        name: "표기, 맞춤법 오류",
        isPrimary: true,
        feedbackCategoryType: "TRANSLATION",
      },
      {
        name: "문법 오류",
        isPrimary: true,
        feedbackCategoryType: "TRANSLATION",
      },
      {
        name: "문체 부적합",
        isPrimary: true,
        feedbackCategoryType: "TRANSLATION",
      },
      { name: "필러", isPrimary: true, feedbackCategoryType: "INTERPRETATION" },
      {
        name: "백트래킹",
        isPrimary: true,
        feedbackCategoryType: "INTERPRETATION",
      },
      { name: "지연", isPrimary: true, feedbackCategoryType: "INTERPRETATION" },
    ],
  });

  await prisma.class.create({
    data: {
      courseId: 1,
      classNumber: 1,
      professors: {
        create: [{ professor: { connect: { id: 1 } } }],
      },
      students: {
        create: [
          { student: { connect: { id: 2 } } },
          { student: { connect: { id: 3 } } },
          { student: { connect: { id: 4 } } },
        ],
      },
      assignments: {
        create: {
          weekNumber: 1,
          assignmentType: "TRANSLATION",
          name: "한->일 번역과제",
          description: "",
          textFile:
            "우리는 별생각 없이 ‘밥이나 한번 먹읍시다’ 라던가 ‘조만간 한번 뵙지요’ 등의 약속 아닌 약속을 남발하는경우가 많다. 이처럼 ‘지켜지리라’는 믿음 혹은 ‘지키겠다’는 의지도 없이, 우리에게는 이런 ‘빈말’들이체면치레나 격식에 가까운 인사말로 건네지는 경우를 종종 보게 된다. 이런 ‘약속’들이 가벼운 말치레가 되어버린 지금, 우리는 그 약속이 의미하는 실제 말의 힘과 단순히 가볍게오가는 인사말 사이에 벌어져 있는 의미의 간극을 헤아릴 줄 알아야 한다. ‘아’로 말하고 ‘어’로 들어야 하는절묘한 언어행위가 지어내는 행간을 읽고, 속내를 들여다보는 재주도 필요하다. 우리 삶의 곳곳에는 또 크고 작은 공공의 약속들이 있다. 이들은 사회의 안정과 질서를 위해서 서로에게암묵적으로 지켜질 것을 전제로 작동한다. 아스팔트 위에 그어진 노란 선 하나도 하나의 약속이고, 자동차를운전하면서, 혹은 건널목 앞에서 하염없이 바라보는 신호등의 삼색도 하나의 약속이다. 참으로 별것 아닌 것같아 보여 그것이 약속이었다는 것조차 잊고 살지언정, 그 의미를 곱씹어 보면 우리의 생명과 직결되어 있는수많은 약속들이 지켜질 것을 기대하면서 도처에 산재해 있음을 알 수 있다. 우리는 언어가 없는 세상을 상상조차 할 수 없다. 많은 종교들에서 행하는 가장 고통스런 수행 가운데 하나가‘묵언수행’이다. 그만큼 한번 말을 하는 능력을 갖게 되면, 그것을 덜어내는 것은 목숨을 잃는 것과도 같은무게감을 가진다. 그럼에도 한없이 가벼워진 말치레들은 때로는 삶을 지탱하는 믿음의 무게 또한 가벼이여겨도 좋다는 신호가 되어버린 것은 아닐까.",
          dueDateTime: new Date().toISOString(),
          feedbackCategories: { connect: { name: "내용오역" } },
        },
      },
    },
  });

  await prisma.class.create({
    data: {
      courseId: 3,
      classNumber: 1,
      professors: {
        create: [{ professor: { connect: { id: 1 } } }],
      },
      students: {
        create: [
          { student: { connect: { id: 2 } } },
          { student: { connect: { id: 3 } } },
          { student: { connect: { id: 4 } } },
        ],
      },
      assignments: {
        create: {
          weekNumber: 1,
          assignmentType: "SEQUENTIAL",
          name: "한->일 순차통역",
          description: "",
          textFile: "",
          dueDateTime: new Date().toISOString(),
          feedbackCategories: { connect: { name: "내용오역" } },
        },
      },
    },
  });

  await prisma.class.createMany({
    data: [
      { courseId: 2, classNumber: 1 },
      { courseId: 4, classNumber: 1 },
    ],
  });

  await prisma.submission.create({
    data: {
      textFile:
        "翌日のことが頭をよぎり、どことなく晴れ晴れしい気分になれない「日曜の夜」を過ごしてきた多くの人が、さかいまさと堺 雅 人主演の「はんざわなおき半沢直樹」のおかげで今、テレビに前のめりになっているだろう。素晴らしいドラマは私たちの気持ちを鼓舞し、日々の生活に大きな影響さえ与える。エンターテインメントは「必要不可欠」なものだ。並々ならぬ半沢ファンを自負する私だが、正直なところ今回は前回ほどの話題作となるのか、少々心配もしていた。前作から７年間のブランクは長すぎたのでは？という気もしたし、コロナ社会に生きる私たちにとって、勧善懲悪を痛快に打ち出す半沢の「倍返し」的世界観が、響きにくくなっているのではないか？という思いがぬぐえずにいた。だが、すでに多くの読者がご存じのとおり、全く杞憂だった。ドラマの内容はもちろん、演者、作り手、全てのスタッフが一丸となり、視聴者に喜んでもらえる作品を",
      assignment: { connect: { id: 1 } },
      student: { connect: { id: 2 } },
      stagedSubmission: {
        create: {
          textFile:
            "翌日のことが頭をよぎり、どことなく晴れ晴れしい気分になれない「日曜の夜」を過ごしてきた多くの人が、さかいまさと堺 雅 人主演の「はんざわなおき半沢直樹」のおかげで今、テレビに前のめりになっているだろう。素晴らしいドラマは私たちの気持ちを鼓舞し、日々の生活に大きな影響さえ与える。エンターテインメントは「必要不可欠」なものだ。並々ならぬ半沢ファンを自負する私だが、正直なところ今回は前回ほどの話題作となるのか、少々心配もしていた。前作から７年間のブランクは長すぎたのでは？という気もしたし、コロナ社会に生きる私たちにとって、勧善懲悪を痛快に打ち出す半沢の「倍返し」的世界観が、響きにくくなっているのではないか？という思いがぬぐえずにいた。だが、すでに多くの読者がご存じのとおり、全く杞憂だった。ドラマの内容はもちろん、演者、作り手、全てのスタッフが一丸となり、視聴者に喜んでもらえる作品を提供しようとする「熱」が、ひとつひとつのシーンににじんでいる。今、「半沢直樹」を心の応援旗として、日々を頑張る人も多いだろう。これだけの作品となれば、アンチも増える。ＳＮＳを通じてあらを探すことを生きがい（？）とする人もいるようだ。だが、それもありだろう。大いに語りあい、さらに盛り上がっていけばいい。",
          assignment: { connect: { id: 1 } },
          student: { connect: { id: 2 } },
          staged: true,
        },
      },
    },
  });

  await prisma.feedback.create({
    data: {
      professor: { connect: { id: 1 } },
      selectedIdx: { start: 0, end: 10 },
      comment: "피드백 코맨트",
      selectedSourceText: false,
      submission: { connect: { id: 1 } },
      categories: { connect: { name: "내용오역" } },
    },
  });
}

main().catch(console.error);
