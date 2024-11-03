import React from 'react'

export const SkillItem: React.FC<{ name: string; experienceYear?: string }> = ({
  name,
  experienceYear
}) => {
  return (
    <>
      <div className="bg-main-light text-sm text-main-blue rounded-full px-3 py-1 shine-effect inline-flex items-center">
        {`${name}${experienceYear ? ` (${experienceYear})` : ''}`}
      </div>
    </>
  )
}
