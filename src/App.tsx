import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { load } from '@tauri-apps/plugin-store'

const wallet: string = '2mkrRJX2F5W9gYtjjXRLHHAmhdoTrW5NySwG55fwNGiB'


function AnimatedNumber({
    value,
    showSign = false,
}: {
    value: number
    showSign?: boolean
}) {
    const [displayValue, setDisplayValue] = useState(value)
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        setAnimate(true)
        const timer = setTimeout(() => {
            setDisplayValue(value)
            setAnimate(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [value])

    return (
        <span
            className={`transition-all duration-500 ease-in-out transform ${
                animate ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
            }`}
        >
            {showSign ? (value >= 0 ? '+' : '') : ''}
            {displayValue.toFixed(2)}
        </span>
    )
}

function App() {
    const [profit, setProfit] = useState(0)
    const [balance, setBalance] = useState(0)
    const [address, setAddress] = useState<string | null>(null)
    const [startBalance, setStartBalance] = useState<number | null>(null)

    useEffect(() => {
        const initStore = async () => {
            const store = await load('config.json', { autoSave: false })
            const storedAddress = await store.get<string>('address')

            if (storedAddress && typeof storedAddress === 'string') {
                setAddress(storedAddress)
            } else {
                await store.set('address', wallet)
                await store.save()
                setAddress(wallet)
            }
        }

        initStore()
    }, [])

    useEffect(() => {
        if (!address) return

        const fetchBalance = async () => {
            try {
                const fetchedBalance = await invoke('get_balance', { address })
                if (typeof fetchedBalance === 'number') {
                    setBalance(fetchedBalance)
                    setStartBalance((prev) =>
                        prev === null ? fetchedBalance : prev
                    )
                }
            } catch (error) {
                console.error('Error fetching balance:', error)
            }
        }

        fetchBalance()
        const interval = setInterval(fetchBalance, 10000)
        return () => clearInterval(interval)
    }, [address])

    useEffect(() => {
        if (startBalance !== null) {
            setProfit(balance - startBalance)
        }
    }, [balance, startBalance])

    return (
        <div
            className='drag-region w-full p-8 bg-gradient-to-r bg-black
            from-[#573e8e] to-[#1b8362] text-white min-h-screen relative'
        >
            <div className='py-6'>
                <img
                    src='/pumpfun.png'
                    alt='pumpfun'
                    className='absolute top-1/2 left-1/2 transform z-0
                    -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-50'
                />

                <div className='relative z-10 flex items-center justify-between'>
                    <div className='flex flex-col space-y-2'>
                        <h2 className='text-gray-200 font-medium text-2xl tracking-wider'>
                            DEPOSIT:
                        </h2>
                        <span className='flex items-center space-x-1'>
                            <p className='text-4xl font-medium text-[#60EEC1] tracking-wider'>
                                <AnimatedNumber
                                    value={balance}
                                    showSign={false}
                                />
                            </p>
                            <img
                                src='/solana2.svg'
                                alt='solana'
                                className='w-8 h-8 relative top-[1px]'
                            />
                        </span>
                    </div>
                    <div className='flex flex-col space-y-2'>
                        <h2 className='text-gray-200 font-medium text-2xl tracking-wider'>
                            PROFIT:
                        </h2>
                        <span className='flex items-center space-x-1'>
                            <p
                                className={`text-4xl font-medium tracking-wider ${
                                    profit >= 0
                                        ? 'text-[#09CE90]'
                                        : 'text-[#FF8080]'
                                }`}
                            >
                                <AnimatedNumber
                                    value={profit}
                                    showSign={true}
                                />
                            </p>
                            <img
                                src={
                                    profit >= 0
                                        ? '/solana1.svg'
                                        : '/solana3.svg'
                                }
                                alt='solana'
                                className='w-8 h-8 relative top-[1px]'
                            />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
