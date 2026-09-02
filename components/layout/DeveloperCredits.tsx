import Image from 'next/image'
import Link from 'next/link'

const DeveloperCredits = () => {
  return (
    <Link
      href="https://www.dromornarh.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-8 flex w-max flex-col items-center gap-2.5 text-center no-underline group"
    >
      <Image
        src="/images/dhronetechlogo.jpg"
        alt="DhroneTech Solutions logo"
        width={1122}
        height={1062}
        className="h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
      <span className="block font-body text-xs tracking-wide text-blush/50 transition-colors group-hover:text-pink">
        Developed by Dromor Narh for DhroneTech Solutions
      </span>
    </Link>
  )
}

export default DeveloperCredits
