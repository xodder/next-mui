import HomePageImpl from '~/components/impls/home';
import PublicLayout from '~/components/layouts/public-layout';

function HomePage() {
  return <HomePageImpl />;
}

HomePage.Layout = PublicLayout;
// HomePage.Guard = DefaultGuard;

export default HomePage;
