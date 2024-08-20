import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from '~/components/page-details';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from '~/components/ui/card';
import { validateRequest } from '~/lib/auth';

export default async function HomePage() {
  const authed = await validateRequest();
  if (!authed.user || !authed.session) redirect('/auth/signin');

  return (
    <>
      <PageHeader>
        <PageTitle>Welcome, {authed.user.username}</PageTitle>
        <PageDescription>This is your dashboard.</PageDescription>
      </PageHeader>
      <PageContent
        container
        className="text-justify"
      >
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum rem ea
        similique exercitationem dolor animi dignissimos asperiores ducimus!
        Tempore neque voluptatem rem dicta deleniti ut, totam enim vero
        laboriosam. Enim nemo repudiandae eaque, sequi, impedit facilis mollitia
        ut eligendi exercitationem molestias obcaecati officiis laborum animi
        consectetur sapiente laudantium. Totam quam ipsum repellendus molestiae
        laudantium dicta ducimus minus amet, iure porro hic, veritatis beatae,
        laboriosam magnam dolorem debitis quidem fuga voluptatem impedit animi
        eligendi ab corrupti nam. Tempore, modi enim minus soluta quae officiis
        possimus tenetur, sapiente quidem magnam odit. Rem cupiditate error
        debitis soluta culpa nostrum facilis perspiciatis, qui nulla inventore?
        Facere, libero obcaecati sit debitis aperiam doloremque asperiores et ea
        porro delectus, velit laborum nesciunt recusandae. Debitis sed officiis
        rem quia qui ullam, quidem ut. Nisi ratione consequatur veritatis cumque
        sint nobis facilis neque labore quia vel eum, dolore dolorum aliquam
        delectus, itaque ad fugit eos. Quae eos deleniti ducimus porro? Quos ex
        ipsam quibusdam odit nostrum sed magni deserunt delectus saepe neque
        aspernatur eligendi inventore tempora expedita iste debitis, alias
        laboriosam in dolor incidunt! Ea, neque. Suscipit, asperiores? Natus
        suscipit facere iure, maiores iste illum cum sapiente dolores tenetur
        dolorem beatae consequuntur possimus ut perferendis vitae inventore
        architecto. Ipsa eligendi voluptatum recusandae. Maxime vero doloribus
        excepturi fugiat voluptatibus reiciendis eligendi facere voluptatum
        veritatis vel iste placeat soluta quo eos tempore, perspiciatis
        provident error maiores ratione sed quidem impedit. Laboriosam, debitis
        culpa atque quisquam quas repellat! Incidunt, beatae animi. Libero
        temporibus architecto rem repellat tempora molestias dicta vitae
        voluptatum. Itaque quae quos porro, adipisci, alias, enim illo sint
        quasi culpa id facere! Id voluptatum at blanditiis odit quis quas,
        obcaecati saepe perspiciatis maxime dignissimos, sit nulla,
        reprehenderit voluptates? Delectus, rem quae aperiam deleniti animi
        libero neque quod illum ullam perferendis sit minus, vel, voluptatibus
        adipisci aliquid assumenda! Beatae rem porro quae labore nihil culpa
        exercitationem provident, corporis, aut, neque maiores doloremque. Quia
        molestiae cupiditate aliquid in nulla voluptate iste fugit tempore a
        veniam nesciunt vero, dolores quas exercitationem sed modi molestias,
        quisquam debitis doloribus assumenda pariatur non ex incidunt! Ratione
        ea vitae minus voluptate voluptates explicabo voluptatum doloribus
        praesentium cumque aperiam exercitationem iusto, vero cum similique quae
        nobis reiciendis eligendi quod molestiae nihil molestias! Pariatur earum
        impedit iusto debitis porro eum expedita quod mollitia labore quaerat
        iste, eos quia perspiciatis eligendi error eius ab quidem et! Omnis sunt
        exercitationem labore. Voluptatum qui quos quod et quasi quibusdam,
        molestiae recusandae aliquid error esse asperiores dicta illo quia neque
        velit non explicabo minus deleniti alias dolor nisi. Modi delectus
        exercitationem architecto nihil porro nulla dolores ad sit, impedit
        eveniet, earum veritatis dicta officia. Nemo quo alias, fuga omnis
        inventore sunt rem molestias, culpa, consectetur atque itaque earum
        distinctio tempore dolorem. Ut qui cum molestiae unde totam debitis
        quibusdam consectetur corrupti. Sint pariatur repudiandae enim, impedit
        dolores quos expedita! Dolore neque illum nulla fugit animi dicta hic
        incidunt tempora, quidem nisi maiores commodi id quod praesentium quam?
        Quam fuga unde cum repellendus. Suscipit qui nobis explicabo aliquam,
        adipisci molestias autem ex perspiciatis ipsa, repudiandae tenetur
        illum, porro non. Ratione esse at ipsam numquam cum illo necessitatibus,
        ex asperiores quisquam quia minus atque quibusdam voluptates eaque,
        placeat eius sint facere qui quos? Nobis sint quasi deserunt mollitia
        perferendis laudantium tempore voluptatum, ullam est quia quas, officiis
        explicabo, odio eius. Laudantium voluptatem rerum, quae nisi enim nobis
        at, velit, cum aliquid non dolor saepe quos eveniet? Recusandae impedit
        rerum possimus explicabo, amet excepturi a consectetur, esse sint totam
        voluptas vitae suscipit commodi, nemo aliquam qui sit minima nesciunt?
        Consequatur, laboriosam amet! Nisi ut ab voluptatum, asperiores dolor
        corrupti dolorem totam neque culpa! Voluptatem, aut?
      </PageContent>
    </>
  );
}
