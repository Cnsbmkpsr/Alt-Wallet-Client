/* This example requires Tailwind CSS v2.0+ */
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, ScaleIcon } from '@heroicons/react/outline'
import Navbar from '../components/Navbar'

const features = [
  {
    name: 'Competitive exchange rates',
    description:
      'Compare and find the best prices for your crypto currency purchases and swaps to maximize your profits.',
    icon: GlobeAltIcon,
  },
  {
    name: 'No hidden fees',
    description:
      'Your transaction fees will be communicated to you in advance, with a comparison to give you an idea of whether your transaction is within the normal cost range or not.',
    icon: ScaleIcon,
  },
  {
    name: 'More details on your transfers',
    description:
      'View a history of your previous transactions, your most recurring recipients, and much more. ',
    icon: LightningBoltIcon,
  },
  {
    name: 'News notifications',
    description:
      'Be informed of any changes on the Ethereum network and its latest news.',
    icon: AnnotationIcon,
  },
]


export default function Home() {
  return (

    <div className="pb-12 bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h1 className=" text-indigo-600 font-semibold tracking-wide uppercase text-2xl">ETH Network Transactions</h1>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to send money
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            New to the world of crypto-currencies? Discover a simple and elegant way to get started in this new world. Our service provides you with many details about your transactions and explains step by step this new universe that is Crypto currency.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>

  )
}
