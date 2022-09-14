# 密码批量重置脚本，不在代码中执行，只能手动执行

Function reset_password {
  Param
    (
      $samAccountName,
      $password
    )
    $user = Get-ADUser -identity $samAccountName
    if($user -eq $null){
      Write-Warning 'user does not exist: ' $samAccountName
      return
    }

    if($password -eq $null){
      Write-Warning 'password does not exist: ' $samAccountName
      return
    }

    $p = ConvertTo-SecureString $password -AsPlainText -Force
    Set-ADAccountPassword -Identity $user -NewPassword $p -Reset
    # 该参数设置 用户登录不需要修改密码
    Set-ADUser $user -ChangePasswordAtLogon:$false
    Write-Host 'success: ' $samAccountName
}
