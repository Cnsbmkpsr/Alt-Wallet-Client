/* This example requires Tailwind CSS v2.0+ */
import { Disclosure } from '@headlessui/react'
import Link from 'next/link'

const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'ETH transaction', href: '/EthTransaction', current: false },
    { name: 'Custom token transaction', href: '/customTokenTransaction', current: false }
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {() => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                        <div className="relative flex items-center content-center justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex-shrink-0 flex items-center">
                                    <img
                                        className="block lg:hidden h-8 w-auto"
                                        src="https://alt.co/wp-content/uploads/2021/11/AltTypeIcon-copy-8.svg"
                                        alt="oui"
                                    />

                                    <img
                                        className="hidden lg:block h-8 w-auto"
                                        src="https://alt.co/wp-content/uploads/2021/11/AltTypeIcon-copy-8.svg"
                                        alt="Workflow"
                                    />
                                </div>
                                <div className="hidden sm:block sm:ml-6">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                            <Link href={item.href}
                                                key={item.href}
                                            >
                                                <a
                                                    key={item.name}
                                                    className={classNames(
                                                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'px-3 py-2 rounded-md text-sm font-medium'
                                                    )}
                                                    aria-current={item.current ? 'page' : undefined}
                                                >
                                                    {item.name}
                                                </a>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


                            </div>
                        </div>
                    </div>

                </>
            )}
        </Disclosure>
    )
}